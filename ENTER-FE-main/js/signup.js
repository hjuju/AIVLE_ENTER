// 전역적으로 관리되는 변수
var interval;   // Timer를 시작하고 종료하는데 큰 공헌을 하는 변수
const errorId = document.getElementById("error-id");
const errorPw = document.getElementById("error-pw");
const errorName = document.getElementById("error-name");
const errorEmail = document.getElementById("error-email");
const errorCerti = document.getElementById("error-certi");
var regIdPw = /^[a-zA-Z0-9]{4,12}$/; 

// '중복 확인'을 click 했을 떄 '아이디 중복 확인'을 확인하는 함수 
function checkDuplicateID() {
    // 1. setting
    var input_id=document.getElementById(`input_id`).value;                                      // 사용자가 입력한 아이디를 가져옴                                                     // 아이디 정규표현식 
    const duplicateID_URL=`http://localhost:8000/account/signUp/checkId/?id=${input_id}`;       // '중복 확인'을 체크해주는 백엔드 URL

    // 2. 사용자가 어떤 아이디를 입력했는가에 따라 서로 다른 로직 구현
    if(input_id==""){                                                                           // 사용자가 입력한 것이 빈칸일 경우 
        errorId.style.display = 'inline-block';
        errorId.textContent = '아이디를 입력해주세요.';
        return false;
    }
   
    else if(!regIdPw.test(input_id)){  
        errorId.style.display = 'inline-block';
        errorId.textContent = '4~12자 영문 대소문자, 숫자만 입력하세요.';                         // 사용자가 입력했으나 유효성 검사가 맞지 않은 경우
        return false;
    }
    else{                                                                                      // 사용자가 입력한 것이 최종적으로 유효성 검사가 통과된 경우
        // 2. 백엔드 측으로부터 '아이디 중복 확인' 코드와 통신(Rest-Api)
        const result = function() {                   
            axios.get(duplicateID_URL).then(
              (response) => {
                console.log(response);

                // 3. 사용자가 입력한 아이디가 '중복 확인' 됐는지 여부에 따라 서로 다른 로직 구현 
                const is_available = response.data.is_available;
                if (is_available) {  // 사용 가능할 때 처리할 이벤트 (아이디 중복 X)
                  errorId.style.display = 'none';
                  Toast.fire({
                    width: '420px',
                    icon: 'success',
                    title: '아이디 설정이 완료되었습니다.'
                  });
                
                  // 3-1. '중복 확인' 버튼  숨기기(Hidden)
                  const duplicate_btn = document.getElementById('check-duplicate');
                  duplicate_btn.style.display = 'none';

                  // 3-2. '아이디 수정하기' 버튼 보여주기(Activate)
                  const modify_btn = document.getElementById('modify-id');
                  modify_btn.style.display = 'block';

                  // 3-3. '아이디 입력' 영역 비활성화(Disabled)
                  document.getElementById('input_id').disabled = true;
                }
                else {             // 사용 불가할 때 처리할 이벤트 (아이디 중복)
                  errorId.style.display = 'inline-block';
                  errorId.textContent = '중복된 아이디가 있습니다. 다시 입력해주세요.';

                  // 1. 입력했던 아이디를 빈칸으로 재설정한다.
                  document.getElementById('input_id').value = '';
                }
            });
          }
          
        result();  // result 함수 호출 
    }
}

// '아이디 수정'을 click했을 떄에 대해 호출한 함수 
function modify_ID(){
    // 1. 입력했던 아이디를 빈칸으로 재설정한다.
    document.getElementById('input_id').value = '';
      
    // 2. 중복 확인' 버튼 보여주기(Activate)
    const duplicate_btn = document.getElementById('check-duplicate');
    duplicate_btn.style.display = 'block';
  
    // 3. '아이디 수정하기' 버튼 숨기기(Hidden)
    const modify_btn = document.getElementById('modify-id');
    modify_btn.style.display = 'none';
  
    // 4. '아이디 입력' 영역 활성화(Abled)
    document.getElementById('input_id').disabled = false;
  }
  
// 비밀번호를 비교하는 함수 
function checkPasswordMatch() {
  console.log('checkPasswordMatch 함수 실행');

    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirm_password').value;

    if (password != confirmPassword) {  // password와 confirmPassword가 다른 경우
        document.getElementById('password_match').textContent = '비밀번호가 일치하지 않습니다.';     // 텍스트 변경
        document.getElementById('password_match').style.color = 'red';                             // 텍스트 색상을 빨간색으로 변경
        document.getElementById('password_match').style.display = 'inline';                        // 요소를 보이게 함
    } 
    else {                              //  password와 confirmPassword가 같은 경우
        document.getElementById('password_match').textContent = '비밀번호가 일치합니다.';            // 텍스트 변경
        document.getElementById('password_match').style.color = 'green';                           // 텍스트 색상을 녹색으로 변경
        document.getElementById('password_match').style.display = 'inline';                        // 요소를 보이게 함
    }
}

// '인증번호 받기' click했을 떄 이를 수행하는 함수
function requestVerificationCode(){
    console.log('requestVerificationCode() 실행');

    // 1. setting 
    var regMail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;   // 이메일 유효성 검사를 위한 변수 
    var input_email=document.getElementById('input_email').value;                                        // 사용자가 입력한 아이디를 가져온다.
    const requestVerifyCode_URL=`http://localhost:8000/utils/sendCertificationNumber/`;                  // 백엔드와 소통할 URL

    // 2. 이메일 유효성 검사
    if (regMail.test(input_email)) {       // 이메일 형식이 맞으면?
      errorEmail.style.display = 'none';
      Toast.fire({
        width: '420px',
        icon: 'success',
        title: '인증 번호를 전송했습니다.'
      });
      document.getElementById('receiveVerificationCodeBtn').disabled=true;

      // 3. 백엔드 측으로부터 '인증번호 받기' 기능 통신(Rest-Api)
      const result=function(){
          axios.post(requestVerifyCode_URL, {'email':input_email, 'purpose':'signup'})
                .then(function (response) {
                  console.log(response);

                  // 4. 타이머 3분 호출 
                  document.querySelector('.timer-container').style.display = 'inline-block';                  // 타이머를 보이게 함
                  document.querySelector('#timer').style.display='inline-block';                              // 타이머를 보이게함
                  document.getElementById('input_email').disabled=true;                                       // '이메일 입력' 칸 비활성화
                  document.getElementById('verifyCodeInput').disabled=false;                                  // '인증번호 입력' 칸 활성화
                  document.getElementById('checkAuthNum').style.display = 'inline-block';                     // '인증번호 확인' 버튼 보이기
                                                                                      
                  timer1();  
                })
                .catch(function (error) {
                  console.log(error);
                  Toast.fire({
                    width: '420px',
                    icon: 'error',
                    title: '에러가 발생했습니다. 다시 시도해주세요.'
                  });
                });
      }

      result();  // result 함수 호출 
    } 
    else {
        errorEmail.style.display = 'inline-block';
        errorEmail.textContent = input_email==''? '이메일을 입력해주세요.':'유효하지 않은 이메일 주소입니다.';

        document.getElementById('input_email').value = '';    // 입력했던 아이디를 빈칸으로 재설정한다.
    }
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
    var input_email=document.getElementById('input_email');                                                                                                           // 이메일 입력칸
    var input_email_value=document.getElementById('input_email').value;                                                                                               // 이메일 입력값
    var receiveVerificationCodeBtn=document.getElementById('receiveVerificationCodeBtn');                                                                             // 인증번호 받기 버튼
    var verifyCodeInput=document.getElementById('verifyCodeInput');                                                                                                   // 인증번호 입력칸
    var verifyCodeInputValue=document.getElementById('verifyCodeInput').value;                                                                                        // 인증번호 입력값
    var checkAuthNumBtn=document.getElementById('checkAuthNum');                                                                                                      // 인증번호 확인 버튼
    var timer = document.querySelector('#timer');                                                                                                                     // 타이머
    var signUpBtn = document.getElementById('signUpBtn');                                                                                                             // 가입하기 버튼 

    const checkAuthNum_URL=`http://localhost:8000/utils/checkCertificationNumber/?email=${input_email_value}&certification_number=${verifyCodeInputValue}&purpose=signup`;  // 백엔드 통신 URL

    // 2. 백엔드 측으로부터 마련해둔 '인증번호 확인' 기능 통신(Rest-Api)
    const result = function() {                     
      axios.get(checkAuthNum_URL).then(
        (response) => {
          console.log(response);
          const is_success=response.data.success;
    
          // 3. success 속성에 따라 서로 다른 로직 부여
          if(is_success==true){
            errorCerti.style.display = 'none';
            Toast.fire({
              width: '420px',
              icon: 'success',
              title: '인증이 완료되었습니다.\n회원가입을 이어서 진행해주세요.'
            }); 
            
            clearInterval(interval);                                                             // 타이머 중지
            document.querySelector('.timer-container').style.display = 'none';                   // 타이머를 안보이게 한다.
            timer.style.display='none';                                                          // 타이머 중지      
            
            input_email.disabled=true;                                                           // 이메일 입력칸 비활성화
            
            receiveVerificationCodeBtn.disabled=true;                                            // 인증번호 받기 버튼 비활성화

            verifyCodeInput.disabled=true;                                                       // 인증번호 입력칸 비활성화 

            checkAuthNumBtn.style.display='none';                                                // 인증번호 확인 버튼 Hidden

            signUpBtn.disabled=false;                                                            // 가입하기 버튼 활성화
          }
          else{
              errorCerti.style.display = 'inline-block';
              errorCerti.textContent = '인증번호가 올바르지 않습니다. 인증 받기를 다시 시도해주세요.';
              
              clearInterval(interval);                                                             // 타이머 중지
              document.querySelector('.timer-container').style.display = 'none';                   // 타이머를 안보이게 한다.
              timer.style.display='none';                                                          // 타이머를 안보이게 한다.

              input_email.disabled=false;                                                          // 이메일 입력칸 활성화
              input_email.value='';                                                                // 이메일 입력값 지우기

              receiveVerificationCodeBtn.disabled=false;                                           // 인증번호 받기 버튼 활성화
            
              verifyCodeInput.disabled=true;                                                       // 인증번호 입력칸 비활성화
              verifyCodeInput.value='';                                                            // 인증번호 입력값 지우기

              checkAuthNumBtn.style.display='none';                                                // 인증번호 확인 버튼 Hidden
          }
      });
    }

    result();
}

// 회사 SELECT(signup.html이 불러와질 떄 자동적으로 호출되는 함수)
document.addEventListener("DOMContentLoaded", function () {
  const company_URL=`http://localhost:8000/account/signUp/company/`;       // 회사 리스트를 불러오는 백엔드 URL
  
  // 비동기 통신으로 회사 정보 가져오기 
  axios.get(company_URL).then(
    (response) => {
      const companyData = response.data.company_list;
      console.log(companyData);

      // HTML select 엘리먼트 참조
      const companySelect = document.getElementById("company_select");

      // 비동기로 가져온 회사 정보를 이용하여 select 옵션 추가
      companyData.forEach(function (company) {
          const option = document.createElement("option");
          option.value = company.company_id;
          option.text = company.company_name;
          companySelect.appendChild(option);
      });
  });
});

//calllback으로 받은 소셜 로그인 정보
const type = new URL(window.location.href).searchParams.get('type');
const socialId = new URL(window.location.href).searchParams.get('socialId');

// '가입하기' 버튼 click했을 떄 이를 수행하는 함수 
function signUp(){
    // 1. setting
    var input_id=document.getElementById('input_id');                                     // 아이디 입력칸    
    var password=document.getElementById('password').value;                               // 비밀번호 value
    var confirmPassword=document.getElementById('confirm_password').value;                // 확인 비밀번호 value
    var name=document.getElementById('name').value;                                       // 이름 value
    var companySelect = document.getElementById('company_select')                         // 회사 아이디 
    var input_email=document.getElementById('input_email');                               // 이메일 입력칸  
    var input_verifyCode=document.getElementById('verifyCodeInput');                      // 인증번호 입력칸

    var signup_URL=`http://localhost:8000/account/signUp/`;                               // 백엔드 '회원가입' URL

    // 2. 유효성 검사
    var is_error = false;
    if(input_id.value=="") {
      errorId.style.display = 'inline-block';
      errorId.textContent = '아이디를 입력해주세요.';
    } else if(input_id.disabled==false){                                                       // 아이디 입력칸이 활성화 됐을 떄 
      errorId.style.display = 'inline-block';
      errorId.textContent = '아이디 중복 확인을 진행해주세요.';
      is_error = true;
    } else {
      errorId.style.display = 'none';
    }

    console.log(password);
    if(password==''){                                                                 // 비밀번호가 빈칸일 떄 
      errorPw.style.display = 'inline-block';
      errorPw.textContent = '비밀번호를 입력해주세요.';
      is_error = true;
    } else if(!regIdPw.test(password)){                                               // 사용자가 입력했으나 유효성 검사가 맞지 않은 경우
      errorPw.style.display = 'inline-block';
      errorPw.textContent = '4~12자 영문 대소문자, 숫자만 입력하세요.';    
      is_error = true;               
    } else if(password!=confirmPassword) {                                                   // 비밀번호와 확인 비밀번호가 다를 떄 
      errorPw.style.display = 'inline-block';
      errorPw.textContent = '비밀번호와 비밀번호 재확인이 일치하지 않습니다.';
      is_error = true;
    } else {
      errorPw.style.display = 'none';
    }
    
    if(name==''){                                                                     // 이름을 입력하지 않았을 떄 
      errorName.style.display = 'inline-block';
      errorName.textContent = '이름을 입력해주세요.';
      is_error = true;
    } else {
      errorName.style.display = 'none';
    }

    if(input_email.value=='') {
      errorEmail.style.display = 'inline-block';
      errorEmail.textContent = '이메일을 입력해주세요.';
      is_error = true;
    } else if(input_email.disabled==false) {
      errorEmail.style.display = 'inline-block';
      errorEmail.textContent = '이메일 인증을 진행해주세요.';
      is_error = true;
    } else {
      errorEmail.style.display = 'none';
    }

    if (is_error == false){
      // 3. 백엔드와 마련한 '회원가입' 코드와 연계한다.
      const result=function(){
          axios.post(signup_URL, 
                    {'user_id':input_id.value,
                    'password':password,
                    'user_email':input_email.value,
                    'certification_number':input_verifyCode.value,
                    'user_name':name,
                    'company_id':companySelect.value,
                    'privacy_agreement':true,
                    'type': type,
                    'social_id': socialId,
                    })
                .then(function (response) {
                  console.log(response);
        
                  // 4. user_id를 받아와서 AI 측과 통신(Rest-Api)
                  axios({
                    method: 'get',
                    url: `http://localhost:8002/new_chat/${input_id.value}`,
                    })
                    .then(response => {
                        console.log('성공');
  
                        // 5. 회원 가입 완료 하면 로그인 페이지(signin.html)로 Routing 한다.
                        window.location.href = '../signin.html';
                    })
                    .catch(error => {
                        console.log('Error :', error);

                        const errorMessageDiv = document.getElementById('error-message');
                        errorMessageDiv.style.display = 'block'; // 오류 메시지 요소를 보이게 설정
                        errorMessageDiv.textContent=error.response.data.message; // 오류 메시지 설정
                    });            
                })
                .catch(function (error) {
                  Toast.fire({
                    width: '420px',
                    icon: 'error',
                    title: '에러가 발생했습니다. 다시 시도해주세요.'
                  }); 
                  console.log(error);
                });
        }

        result();  // result 함수 호출
    }
}