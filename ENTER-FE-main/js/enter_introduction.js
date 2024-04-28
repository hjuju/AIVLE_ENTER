const getUserInfo_URL= 'http://localhost:8000/account/auth/userInfo/';  // 백엔드 소통 URL 
const token = getWithExpire('accessToken');                            // 토큰을 받아온다.

// enter_introduction.html을 불러왔을 떄 로그인 여부를 판별한다.
window.addEventListener('DOMContentLoaded', (event) => {
    // 로그인 상태이면?
    if (token!==null) {
        // 백엔드 코드를 이용해서 유저 정보 불러오기
        getUserInfo();
    } 
    // 비로그인 상태이면?
    else {
      // Header 창 오른쪽 '~님 안녕하세요!!를 보여주지 않도록 한다.
      document.querySelector('header .header-link').style.display='none';
      document.querySelector('header .login').style.display = 'block';
    }
});

// 백엔드측으로부터 유저 정보를 불러오는 함수 
function getUserInfo(){
    // 백엔드측으로부터 유저 정보를 불러오는 통신(Rest-Api) 
    axios({
        method: 'get',
        url: getUserInfo_URL,
        headers: { 
            'Authorization':  JSON.stringify({'Authorization': `Bearer ${token}`})
        }
    })
    .then(response => {
        // 요청이 성공하면 이 부분이 실행됩니다.
        console.log('성공:', response.data); // 로그에 응답 데이터를 찍습니다.

        document.querySelector('.header-link h3').textContent = `${response.data.data.user_name}님 안녕하세요`; // h3 태그에 보여준다.
        document.querySelector('header .logout').style.display = 'block';
    })
    .catch(error => {
        console.log('error : ', error);
        alert('에러');
    });
}

// '프롬프트 사용하기' 버튼 클릭 시 이벤트 처리
document.getElementById('promptButton').addEventListener('click', () => {
    window.location.href='../index.html';
});

// 하단에 '프롬프트 사용하기' 버튼 클릭 시 이벤트 처리
document.getElementById('belowPromptButton').addEventListener('click', () => {
    window.location.href='../index.html';
});