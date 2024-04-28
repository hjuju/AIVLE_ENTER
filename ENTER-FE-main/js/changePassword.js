//calllback으로 받은 아이디
const selectId = new URL(window.location.href).searchParams.get('id');              // 아이디 찾기에서 넘어온 경우

// 아이디 찾기에서 넘어온 경우
if (selectId) {
    document.getElementById('input_id').value = selectId;
}


// 전역적으로 관리되는 변수
var interval;                                                                       // Timer를 시작하고 종료하는데 큰 공헌을 하는 변수
const errorId = document.getElementById("error-id");
const errorPw = document.getElementById("error-pw");
const errorEmail = document.getElementById("error-email");
const errorCerti = document.getElementById("error-certi");
var regIdPw = /^[a-zA-Z0-9]{4,12}$/;

// 아이디 확인하는 함수 
function checkId(){
    const input_id=document.getElementById('input_id').value;
    
    // 아이디 미입력
    if (input_id == '') {
        errorId.style.display = 'inline-block';
        errorId.textContent = '아이디를 입력해주세요.';
        return false;
    }

    // 백엔드측으로부터 '중복된 아이디 확인' 하는 통신(Rest-Api) 
    const checkId_URL=`http://localhost:8000/account/auth/checkId/?id=${input_id}`;
    axios.get(checkId_URL).then(
        (response) => {
            if (response.data.is_exist) {
                errorId.style.display = 'none';
                Toast.fire({
                    width: '420px',
                    icon: 'success',
                    title: '아이디 확인에 성공하였습니다.\n비밀번호 찾기를 이어서 진행해주세요.'
                });
                document.getElementById('receiveVerificationCodeBtn').disabled=false;
                document.getElementById('check-id').style.display='none';
                document.getElementById('modify-id').style.display='block';
                document.getElementById('input_id').disabled=true;
            } 
            else {
                errorId.style.display = 'inline-block';
                errorId.textContent = '존재하지 않는 아이디입니다. 다시 입력해주세요.';
            }
    });
}

// 아이디 수정하는 함수
function modify_ID(){
    // 1. 입력했던 아이디를 빈칸으로 재설정한다.
    document.getElementById('input_id').value = '';
      
    // 2. 아이디 확인' 버튼 보여주기(Activate)
    const check_btn = document.getElementById('check-id');
    check_btn.style.display = 'block';
  
    // 3. '아이디 수정하기' 버튼 숨기기(Hidden)
    const modify_btn = document.getElementById('modify-id');
    modify_btn.style.display = 'none';
  
    // 4. '아이디 입력' 영역 활성화(Abled)
    document.getElementById('input_id').disabled = false;

    // 5. 인증번호 받기 버튼 비활성화
    document.getElementById('receiveVerificationCodeBtn').disabled=true;

  }
 
// '인증번호 받기' button click했을 떄 이를 수행하는 함수
function requestVerificationCode(){
    // 1. setting 
    var regMail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;   // 이메일 유효성 검사를 위한 변수 
    var input_id=document.getElementById('input_id').value;                                              // 사용자가 입력한 아이디를 가져온다.
    var input_email=document.getElementById('input_email').value;                                        // 사용자가 입력한 아이디를 가져온다.
    const requestVerifyCode_URL=`http://localhost:8000/utils/sendCertificationNumber/`;                  // 백엔드와 소통할 URL
    var is_error = false;

    // 2. 아이디 이메일 유효성 검사
    if (input_id == '') {
        errorId.style.display = 'inline-block';
        errorId.textContent = '아이디를 입력해주세요.';
        is_error = true;
    }
    if (input_email == '') {
        errorEmail.style.display = 'inline-block';
        errorEmail.textContent = '이메일을 입력해주세요.';
        is_error = true;
    } else if (regMail.test(input_email)==false) {
        errorEmail.style.display = 'inline-block';
        errorEmail.textContent = '유효하지 않은 이메일입니다.';
        is_error = true;
    }
    if (is_error) {
        return false;
    }

    errorEmail.style.display = 'none';
    Toast.fire({
        width: '420px',
        icon: 'success',
        title: '인증 번호를 전송했습니다.\n단, 회원정보와 일치하지 않을경우 이메일이 전송되지 않습니다.'
    });

    // 4. 백엔드측으로부터 '인증번호'를 받는 통신(Rest-Api)
    const result=function(){
        axios.post(requestVerifyCode_URL, {'email':input_email, 'purpose':'findPW', 'user_id':input_id})
                .then(function (response) {
                    console.log(response);

                    if(response.data.success) {
                        
                        document.querySelector('.timer-container').style.display = 'inline-block';                  // 타이머를 보이게 함
                        document.querySelector('#timer').style.display='inline-block';                              // 타이머를 보이게함
                        document.getElementById('input_email').disabled=true;                                       // '이메일 입력' 칸 비활성화
                        document.getElementById('receiveVerificationCodeBtn').disabled=true;                        // '인증번호 받기' 칸 비활성화
                        document.getElementById('verifyCodeInput').disabled=false;                                  // '인증번호 입력' 칸 활성화
                        document.getElementById('checkAuthNum').style.display = 'inline-block';                     // '인증번호 확인' 버튼 보이기
                                                                                            
                        timer1(); 
                    } else {
                        errorEmail.style.display = 'inline-block';
                        errorEmail.textContent = response.data.message + ' 이메일 수정 후 다시 시도해주세요.';
                        return false;
                    }
                 
                })
                .catch(function (error) {
                console.log(error);
                });
    }

    result(); 
}

// 타이머 작동 함수 1
function timer1() {
    var oneMinute = 180,
        display = document.querySelector('#timer'),
        emailInput = document.querySelector('#input_email');                                    // 이메일 입력 필드 선택
        verfiyCodeInput=document.querySelector('#verifyCodeInput');                             // 인증번호 입력 필드 선택

    timer2(oneMinute, display, emailInput, verfiyCodeInput);
}

// 타이머 작동 함수 2
function timer2(duration, display, emailInput, verfiyCodeInput) {
    var timer = duration, minutes, seconds;
    interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {

            Toast.fire({
                width: '420px',
                icon: 'error',
                title: '인증 시간이 지났습니다. 다시 시도해주세요.'
            });                                    
                               

            clearInterval(interval);                                                              // 타이머 종료
            display.style.display = 'none';                                                       // 타이머 숨기기

            emailInput.value = '';                                                                // 이메일 입력 필드 초기화
            document.getElementById('input_email').disabled = false;                              // '이메일 입력' 칸 활성화

            verfiyCodeInput.value='';                                                             // '인증번호 입력' 필드 초기화
            document.getElementById('verifyCodeInput').disabled=true;                             // '인증번호 입력' 칸 비활성화

            document.getElementById('receiveVerificationCodeBtn').disabled=false;                 // '인증번호 받기' 칸 활성화
            
            document.getElementById('checkAuthNum').style.display = 'none';                       // '인증번호 입력' 버튼 비활성화
        }                                                                                         
    }, 1000);
}

// '인증번호 확인' 버튼 click했을 떄 이를 수행하는 함수
function checkAuthNum(){
    // 1. setting
    var input_email=document.getElementById('input_email');                                                                                                                 // 이메일 입력칸
    var input_email_value=document.getElementById('input_email').value;                                                                                                     // 이메일 입력값
    var receiveVerificationCodeBtn=document.getElementById('receiveVerificationCodeBtn');                                                                                   // 인증번호 받기 버튼
    var verifyCodeInput=document.getElementById('verifyCodeInput');                                                                                                         // 인증번호 입력칸
    var verifyCodeInputValue=document.getElementById('verifyCodeInput').value;                                                                                              // 인증번호 입력값
    var checkAuthNumBtn=document.getElementById('checkAuthNum');                                                                                                            // 인증번호 확인 버튼
    var timer = document.querySelector('#timer');                                                                                                                           // 타이머
    var changePasswordBtn = document.getElementById('changePasswordBtn');                                                                                                                   // 비밀번호 변경 버튼 
    
    if (verifyCodeInputValue == '') {
        errorCerti.style.display = 'inline-block';
        errorCerti.textContent = '인증번호를 입력해주세요.';
        return false;
    }

    errorCerti.style.display = 'none';
    Toast.fire({
        width: '420px',
        icon: 'success',
        title: '인증 번호를 전송했습니다.'
    });

    const checkAuthNum_URL=`http://localhost:8000/utils/checkCertificationNumber/?email=${input_email_value}&certification_number=${verifyCodeInputValue}&purpose=findPW`;  // 백엔드 통신 URL

    // 2. 백엔드측으로부터 '인증번호'를 확인하는 통신(Rest-Api)
    const result = function() {                     
    axios.get(checkAuthNum_URL).then(
        (response) => {
        console.log(response);
        const is_success=response.data.success;
    
        // 3. success 속성에 따라 서로 다른 로직 부여
        if(is_success==true){

            Toast.fire({
                width: '420px',
                icon: 'success',
                title: '인증이 완료되었습니다.\n비밀번호 변경을 이어서 진행해주세요.'
            });
                                                                                                
            clearInterval(interval);                                                                    // 타이머 중지
            document.querySelector('.timer-container').style.display = 'none';                          // 타이머를 안보이게 한다.
            timer.style.display='none';                                                                 // 타이머를 안보이게 한다.    
            
            input_email.disabled=true;                                                                   // 이메일 입력칸 비활성화
            
            receiveVerificationCodeBtn.disabled=true;                                                    // 인증번호 받기 버튼 비활성화

            verifyCodeInput.disabled=true;                                                               // 인증번호 입력칸 비활성화 

            checkAuthNumBtn.style.display='none';                                                        // 인증번호 확인 버튼 Hidden

            changePasswordBtn.disabled=false;                                                            // 가입하기 버튼 활성화
        }
        else{  
            errorCerti.style.display = 'inline-block';
            errorCerti.textContent = '인증번호가 올바르지 않습니다. 인증 받기를 다시 시도해주세요.';                                        
            
            clearInterval(interval);                                                                     // 타이머 중지
            document.querySelector('.timer-container').style.display = 'none';                           // 타이머를 안보이게 한다.
            timer.style.display='none';                                                                  // 타이머 중지

            input_email.disabled=false;                                                                  // 이메일 입력칸 활성화
            input_email.value='';                                                                        // 이메일 입력값 지우기

            receiveVerificationCodeBtn.disabled=false;                                                   // 인증번호 받기 버튼 활성화
            
            verifyCodeInput.disabled=true;                                                               // 인증번호 입력칸 비활성화
            verifyCodeInput.value='';                                                                    // 인증번호 입력값 지우기

            checkAuthNumBtn.style.display='none';                                                        // 인증번호 확인 버튼 Hidden
        }
    });
    }

    result();
}

// 비밀번호를 비교하는 함수 
function checkPasswordMatch() {
    console.log('checkPasswordMatch 함수 실행');

    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirm_password').value;

    if (password != confirmPassword) {  // password와 confirmPassword가 다른 경우
        document.getElementById('password_match').textContent = '비밀번호가 일치하지 않습니다.';           // 텍스트 변경
        document.getElementById('password_match').style.color = 'red';                                   // 텍스트 색상을 빨간색으로 변경
        document.getElementById('password_match').style.display = 'inline';                              // 요소를 보이게 함
    } 
    else {                              //  password와 confirmPassword가 같은 경우
        document.getElementById('password_match').textContent = '비밀번호가 일치합니다.';                  // 텍스트 변경
        document.getElementById('password_match').style.color = 'green';                                 // 텍스트 색상을 녹색으로 변경
        document.getElementById('password_match').style.display = 'inline';                              // 요소를 보이게 함
    }
}

// '비밀번호 변경' 버튼 click 했을 떄 호출되는 함수
function changePassword(){
    // 1. setting
    const input_id=document.getElementById('input_id').value;                                             // 아이디 입력칸    
    const password=document.getElementById('password').value;                                             // 비밀번호 value
    const confirmPassword=document.getElementById('confirm_password').value;                              // 확인 비밀번호 value

    const input_email=document.getElementById('input_email').value;                                       // 이메일 입력칸  
    const input_verifyCode=document.getElementById('verifyCodeInput').value;                              // 인증번호 입력칸

    const changePassword_URL=`http://localhost:8000/account/auth/changePassword/`; 
    
    // 유효성 검사
    var is_error = false;
    // 1. 아이디가 빈값인 경우
    if(input_id==''){
        errorId.style.display = 'inline-block';
        errorId.textContent = '아이디를 입력해주세요.';
        is_error = true;
    } 
    else {
        errorId.style.display = 'none';
    }

    // 2. 비밀번호가 빈값인 경우
    if(password==''){
        errorPw.style.display = 'inline-block';
        errorPw.textContent = '비밀번호를 입력해주세요.';
        is_error = true;
    } 
    else if(!regIdPw.test(password)){                                                      // 사용자가 입력했으나 유효성 검사가 맞지 않은 경우
        errorPw.style.display = 'inline-block';
        errorPw.textContent = '4~12자 영문 대소문자, 숫자만 입력하세요.';    
        is_error = true;               
    }
    else if(password!=confirmPassword) {                                                   // 비밀번호와 확인 비밀번호가 다를 떄 
        errorPw.style.display = 'inline-block';
        errorPw.textContent = '비밀번호와 비밀번호 재확인이 일치하지 않습니다.';
        is_error = true;
    } 
    else {
        errorPw.style.display = 'none';
    }


    // 4. 검증 통과
    if (is_error == false){
        // 백엔드측으로부터 '비밀번호 변경' 하는 통신(Rest-Api)
        axios.post(changePassword_URL, {
            'user_id': input_id, 
            'email': input_email,
            'certification_number': parseInt(input_verifyCode), 
            'password': password,
        })
        .then(function (response) {
            console.log(response.data); // 성공적인 응답 처리

            Toast.fire({
                width: '420px',
                icon: 'success',
                title: '비밀번호가 변경되었습니다.'
            });

            window.location.href='../signin.html'; // 라우팅
        })
        .catch(function (error) {
            console.error(error); // 에러 처리

            Toast.fire({
                width: '420px',
                icon: 'error',
                title: '비밀번호가 변경에 실패하였습니다. 다시 시도해주세요.'
            });
        });
    }
}