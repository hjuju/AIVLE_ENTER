// 전역 변수
let user_id; // 사용자 id 
let token;   // 토큰 

// withdrawAccount.html을 불러왔을 떄 로그인 여부를 판별한다.
window.addEventListener('DOMContentLoaded', (event) => {
    console.log('새로고침');

    checkLoginStatusAndUpdateUI();
});

// 로그인 여부를 판별하는 함수
function checkLoginStatusAndUpdateUI() {
    token = getWithExpire('accessToken'); // 토큰을 받아온다.

    // 로그인 상태이면?
    if (token!==null) {
        // 백엔드 코드를 이용해서 유저 정보 불러오기
        getUserInfo(token);
    } 
    // 비로그인 상태이면?
    else {
        // 로그인 후 이용 가능함
        window.location.href = '../index.html';
    }
}

// 유저 정보 불러오는 함수 
function getUserInfo(token){
    const getUserInfo_URL= 'http://localhost:8000/account/auth/userInfo/';  // 백엔드 소통 URL


    // 백엔드 측으로부터 유저 정보 불러오는 통신(Rest-Api) 
    axios({
        method: 'get',
        url: getUserInfo_URL,
        headers: { 
            'Authorization':  JSON.stringify({'Authorization': `Bearer ${token}`})
        }
    })
    .then(response => {
        // 요청이 성공하면 이 부분이 실행됩니다..
        user_id = response.data.data.user_id;
        document.querySelector('header .logout').style.display = 'block';
        user_name=response.data['data']['user_name'];   
        document.querySelector('.header-link h3').textContent = `${user_name}님 안녕하세요`; // h3 태그에 보여준다.
    })
    .catch(error => {
        alert('에러');
    });
}

// '탈퇴하기' 버튼 click 했을 떄 수행되는 함수 
function withdrawAccount(){
    // 1. setting
    var termscheckbox = document.getElementById('termsCheckbox');              // 서비스 탈퇴 안내 사항
    var radios = document.getElementsByName('reason');                         // 탈퇴 사유
    var radiosSelected = false;                                                // 탈퇴 사유 check에 대한 flag


    // 2. 체크 여부 검사
    if(!termscheckbox.checked){
        Toast.fire({
            width: '500px',
            padding: '20px',
            icon: 'error',
            title: '서비스 탈퇴 안내 사항 약관에 동의해주세요.'
        });
    } 
    else {
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                radiosSelected = true;
                break;
            }
        }
    
        if (radiosSelected) {
            // 사용자가 비밀번호를 입력하도록 팝업을 띄운다.
            showPasswordModal(); // 비밀번호 입력 모달 표시
        } 
        else {
            Toast.fire({
                width: '500px',
                padding: '20px',
                icon: 'error',
                title: '탈퇴 사유에 대해서 체크 해주세요.'
            });
        }
    }
}

// 사용자가 비밀번호를 입력하도록 요청하는 팝업을 표시하는 함수
// 모달을 화면 중앙에 표시하고 요소들을 세로로 배치하는 스타일로 수정
const modal = document.getElementById('modal');
function showPasswordModal() {
    modal.style.display = 'block';
}

// 모달에서 '확인' 버튼을 클릭했을 때 실행되는 함수
function confirmPassword() {
    var password = document.getElementById('password').value;
    var checkPassword = document.getElementById('check-password').value;

    if (password === ''){
        Toast.fire({
            width: '500px',
            padding: '20px',    
            icon: 'error',
            title: '비밀번호를 입력해주세요.'
        });
        return false;
    } else if (checkPassword == ''){
        Toast.fire({
            width: '500px',
            padding: '20px',    
            icon: 'error',
            title: '비밀번호 확인을 입력해주세요.'
        });
        return false;
    } else if (password != checkPassword){
        Toast.fire({
            width: '500px',
            padding: '20px',    
            icon: 'error',
            title: '비밀번호와 비밀번호 확인이 일치하지 않습니다.'
        });
        return false;
    }
    else {
        
        // 정말 삭제할건지 묻기
        Swal.fire({
            title: '정말 탈퇴하시겠습니까?',
            text: "탈퇴한 유저 데이터는 복구할 수 없습니다!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#454997',
            confirmButtonText: '탈퇴',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                const signOut_URL= 'http://localhost:8000/account/auth/signOut/';  // 백엔드 소통 URL

                 // 백엔드 측으로부터 '탈퇴 기능'과 통신(Rest-Api)
                axios({
                    method: 'post',
                    url: signOut_URL,
                    headers: { 
                        'Authorization': JSON.stringify({'Authorization': `Bearer ${token}`}),
                    },
                    data: {'user_id': user_id, 'password': password} 
                })
                .then(response => {
                    if(response.data.success) {
                        localStorage.removeItem('accessToken');            // localStorage에 accessToken 제거
                        window.location.href='../index.html'               // index.html로 Routing 하기
                    } else {
                        modal.style.display = 'none';
                        Toast.fire({
                            width: '500px',
                            padding: '20px',    
                            icon: 'error',
                            title: '오류가 발생했습니다. 다시 시도해주세요.',
                            text: '사유: ' + response.data.message
                        });
                        return false;
                    }
                })
                .catch(error => {
                    modal.style.display = 'none';
                    Toast.fire({
                        width: '500px',
                        padding: '20px',    
                        icon: 'error',
                        title: '오류가 발생했습니다. 다시 시도해주세요.',
                    }); 
                });
            }

        });
        
    }
}

// 모달 닫기 버튼 클릭 시 이벤트 처리
const closeModalBtn = document.getElementById('closeModalBtn');
closeModalBtn.addEventListener('click', function () {
    modal.style.display = 'none';
});

// 모달 바깥 영역 클릭 시 모달 닫기
window.addEventListener('click', function (event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}); 