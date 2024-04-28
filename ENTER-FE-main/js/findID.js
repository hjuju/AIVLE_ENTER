const errorName = document.getElementById("error-name");
const errorEmail = document.getElementById("error-email");
const userModal = document.getElementById("userIdModal");

// 아이디 찾는 함수 
function findId() {
    const findIdURL=`http://127.0.0.1:8000/account/auth/findID/`;
    const userData = {
        user_name: document.getElementById('name').value,
        email: document.getElementById('input_email').value
    };
    var is_error = false;

    if (userData.user_name == "") {
        errorName.style.display = 'inline-block';
        errorName.textContent = '이름을 입력해주세요.';
        is_error = true;
    } 
    else {
        errorName.style.display = 'none';
    }

    if (userData.email == "") {
        errorEmail.style.display = 'inline-block';
        errorEmail.textContent = '이메일을 입력해주세요.';
        is_error = true;
    } 
    else {
        errorEmail.style.display = 'none';
    }

    if (is_error) {
        return;
    }

    // 백엔드 측으로부터 '아이디 찾기' 기능을 통신(Rest-Api)
    axios.post(findIdURL, userData)
    .then(response => {
        if(response.data.success) {
            showUserIdPopup(response.data.id_list); // 찾은 아이디를 모달창으로 보여주는 함수를 실행한다.
        } 
        else {
            Toast.fire({
                width: '420px',
                padding: '20px',    
                icon: 'error',
                title: response.data.message
            });
        }
        
    })
    .catch(error => {
        console.log(error);
        Toast.fire({
            width: '420px',
            padding: '20px',
            icon: 'error',
            title: '오류가 발생했습니다. 다시 시도해주세요.'
        });
    });
}

// 찾은 아이디를 모달창 형태로 보여주는 함수 
function showUserIdPopup(userIdList) {
    const maxLength = Math.max(...userIdList.map(user => user.id.length));
    const userIdElements = userIdList.map(user => {
        const space = "&nbsp;".repeat(maxLength - user.id.length +2);
        const maskedId = maskUserId(user.id) + space;
        return `<p><label><input type='radio' name="selct-id" value="${user.id}"/> ${maskedId} [가입일: ${user.register_date}]</label></p>`;
    });

    document.getElementById("userIdList").innerHTML = `<div>${userIdElements.join("")}</div>`;
    userIdModal.style.display = "block";
}

// 모달창 나가기 함수
function closeUserIdPopup() {
    userIdModal.style.display = "none";
}

// 모달 바깥 영역 클릭 시 모달 닫기
window.addEventListener('click', function (event) {
    if (event.target === userIdModal) {
        userIdModal.style.display = "none";
    }
}); 

// 마스킹 적용 함수
function maskUserId(userId) {
    if (userId.length <= 1) {
        return userId;
    } 
    else if (userId.length === 2) {
        return userId.charAt(0) + '*';
    } 
    else {
        const partLength = Math.floor(userId.length / 2);
        const maskedPart = '*'.repeat(partLength);
        return userId.substring(0, 1) + maskedPart + userId.substring(userId.length - 1, userId.length);
    }
}

// 모달창 - 로그인 함수
function signIn() {
    const selectId = document.querySelector("input[name='selct-id']:checked")
    if (selectId != null) {
        location.href = `../signin.html?id=${selectId.value}`;
    } 
    else {
        Toast.fire({
            width: '420px',
            padding: '20px',
            icon: 'error',
            title: '아이디를 선택해주세요.'
        });
    }
}

// 모달창 - 비밀번호 변경 함수
function changePassword() {
    const selectId = document.querySelector("input[name='selct-id']:checked")
    if (selectId != null) {
        location.href = `../changePassword.html?id=${selectId.value}`;
    } else {
        Toast.fire({
            width: '420px',
            padding: '20px',
            icon: 'error',
            title: '아이디를 선택해주세요.'
        });
    }    
}

