// 0. 토큰(로그인 여부) 확인
const myToken = getWithExpire('accessToken'); // 토큰을 받아온다.

if (myToken === null) {
    window.location.href = '../index.html';
} else {
    // 1. 페이지 라우팅
    mypageURL = `http://127.0.0.1:8000/board/myinfo/`;
    const config = {
        headers: {
            'Authorization': JSON.stringify({'Authorization': `Bearer ${myToken}`})
        }
    }

    axios.get(mypageURL, config)
    .then(response => {
        console.log('success');
        console.log(response);
        mypageInfo = response['data'];
        
        mypageUserHeader1 = document.querySelector('.header-link h3');
        mypageUserHeader2 = document.querySelector('.content-header-username');
        mypageId = document.querySelector('.content-body-item-body1');
        mypagePw = document.querySelector('.content-body-item-body2');
        mypageName = document.querySelector('.content-body-item-body3');
        mypageEmail = document.querySelector('.content-body-item-body4');
        mypageRole = document.querySelector('.content-header-usertype');

        mypageUserHeader1.append(mypageInfo['user_name'] + '님 안녕하세요');
        document.querySelector('header .logout').style.display = 'block';
        mypageUserHeader2.append(mypageInfo['user_name']);
        mypageId.append(mypageInfo['user_id']);
        mypagePw.append(mypageInfo['password']);
        mypageName.append(mypageInfo['user_name']);
        mypageEmail.append(mypageInfo['user_email']);
        if (mypageInfo['role'] === 'user') {
        } else {
            mypageRole.append('관리자');
        }
    })
    .catch(error => {
        console.log('failed');
        console.log(error);
    })
}

// 2. 비밀번호 변경
function changePassword(){
    const popupUrl = "changePassword.html";
    const popupName = "비밀번호 변경";

    var popWidth = (document.body.offsetWidth / 2) - (600 / 2);
    var popHeight = (window.screen.height / 2) - (600 / 2);

    const popupOption = "location = no, width = 600, height = 600, top = " + popHeight + ",left = " + popWidth;
    console.log(popupOption);
    window.open(popupUrl, popupName, popupOption);

}

// 3. 회원 탈퇴
function withdrawAccount(){
    window.location.href = '../withdrawAccount.html';
}