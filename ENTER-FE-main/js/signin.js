const loginURL=`http://127.0.0.1:8000/account/auth/signIn/`;
const signUpURL = `http://localhost:5500/signup.html`;
const closeModalBtn = document.getElementById('closeModalBtn');
const syncBtn = document.getElementById('syncAccountBtn');
const signUpBtn = document.getElementById('signUpBtn');
const modal = document.getElementById('socialModal');
const syncView = document.getElementById('syncView');
const errorLogin = document.getElementById("error");
const errorModal = document.getElementById("error-modal");

// '로그인' 버튼 클릭했을 떄 호출되는 함수 (일반 로그인)
function signin() {
    const userData = {
        user_id: document.getElementById('input_id').value,
        password: document.getElementById('input_password').value,
        type: "",
    };

    if (userData.user_id == "" | userData.password == "") {
        errorLogin.style.display = 'inline-block';
    
        if (userData.user_id == "") {
            errorLogin.textContent = '아이디를 입력해주세요.';
        } else if (userData.password == "") {
            errorLogin.textContent = '비밀번호를 입력해주세요.';
        }
        return;
    }
      
    // 백엔드 측으로부터 '로그인' 기능 통신(Rest-Api)
    axios.post(loginURL, userData)
    .then(response => {
        if (response.data.success) {
            // localStroage에 토큰(Token)을 적재한다.
            const accessToken = response['data']['data']['token'];
            setWithExpire('accessToken', accessToken, 12*60*60*1000); //12 시간

            console.log(response.data);

            // index.html로 Routing 한다.
            window.location.href = '../index.html';
        } else {
            errorLogin.style.display = 'inline-block';
            errorLogin.textContent = '아이디 또는 비밀번호를 잘못 입력했습니다.';
        }
        
    })
    .catch(error => {
        console.log(error);
        errorLogin.style.display = 'inline-block';
        errorLogin.textContent = '로그인에 실패했습니다. 다시 시도해주세요.';
    });
}

//calllback으로 받은 인가코드 및 아이디
const code = new URL(window.location.href).searchParams.get('code');
const type = new URL(window.location.href).searchParams.get('type');
const selectId = new URL(window.location.href).searchParams.get('id'); // 아이디 찾기에서 넘어온 경우

// 아이디 찾기에서 넘어온 경우
if (selectId) {
    document.getElementById('input_id').value = selectId;
}

// 소셜 로그인
const socialLogin = async(type) => {
    axios({
        url: `http://localhost:8000/account/${type}Login/`,
        method: 'post',
        data: {code: code},
    })
    .then(response => {
        console.log('성공:', response.data); // 로그에 응답 데이터를 찍습니다.

        // 2-1. 로그인 성공 (로그인 후 프롬프트 페이지로 이동)
        if (response.data.message == "exists") {
            // localStroage에 토큰(Token)을 적재한다.
            const accessToken = response.data.data.token;
            setWithExpire('accessToken', accessToken, 12*60*60*1000); //12 시간

            // index.html로 Routing 한다.
            window.location.href = '../index.html';
        } else {
            // 2-2. 로그인 실패 (모달창 띄우기)
            modal.style.display = 'block';
            document.getElementById("socialType").value = type;
            document.getElementById("socialId").value = response.data.data.id;
            document.getElementById("signUpBtn").setAttribute("onclick", `location.href='${signUpURL}?type=${type}&socialId=${response.data.data.id}'`);
        }
    })
    .catch(error => {
        console.log(error);
        errorLogin.style.display = 'inline-block';
        errorLogin.textContent = '로그인에 실패했습니다. 다시 시도해주세요.';
    });
}

// code가 있으면?
if (code) {
    socialLogin(type);
}
    
// 모달창 이벤트 처리
// 모달 닫기 버튼 클릭 시 이벤트 처리
closeModalBtn.addEventListener('click', function () {
    location.href = '../signin.html';
});

// 모달 바깥 영역 클릭 시 모달 닫기
window.addEventListener('click', function (event) {
    if (event.target === modal) {
        location.href = '../signin.html';
    }
}); 

// 기존 회원 연동 버튼 클릭시
syncBtn.addEventListener('click', function () {
    syncView.style.display = 'flex';
})

// 소셜 연동 로그인
function syncLogin() {
    userData = {
        type: document.getElementById("socialType").value,
        social_id: document.getElementById("socialId").value,
        user_id: document.getElementById("syncId").value,
        password: document.getElementById("syncPassword").value,
    }

    if (userData.user_id == "" | userData.password == "") {
        error.style.display = 'inline-block';
    
        if (userData.user_id == "") {
            errorModal.textContent = '아이디를 입력해주세요.';
        } else if (userData.password == "") {
            errorModal.textContent = '비밀번호를 입력해주세요.';
        }
        return;
    }

    axios.post(loginURL, userData)
    .then(response => {
        if (response.data.success) {
            // localStroage에 토큰(Token)을 적재한다.
            const accessToken = response['data']['data']['token'];
            setWithExpire('accessToken', accessToken, 12*60*60*1000); //12 시간
            window.location.href = '../index.html';
        } else {
            errorModal.style.display = 'inline-block';
            errorModal.textContent = '아이디 또는 비밀번호를 잘못 입력했습니다.';
        }
        
    })
    .catch(error => {
        console.log(error);
        errorModal.style.display = 'inline-block';
        errorModal.textContent = '로그인에 실패했습니다. 다시 시도해주세요.';
    });

}