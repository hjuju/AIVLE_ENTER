// inquiry.html을 불러왔을 떄 로그인 여부를 판별한다.
window.addEventListener('DOMContentLoaded', (event) => {
    console.log('새로고침');

    checkLoginStatusAndUpdateUI();
});

// 로그인 여부를 판별하는 함수
function checkLoginStatusAndUpdateUI() {
    const token = getWithExpire('accessToken'); // 토큰을 받아온다.

    // 로그인 상태이면?
    if (token!==null) {
        // 백엔드 코드를 이용해서 유저 정보 불러오기
        getUserInfo(token);
    } 
    // 비로그인 상태이면?
    else {
       // Header 창 오른쪽 '~님 안녕하세요!!를 보여주지 않도록 한다.
      document.querySelector('header .header-link').style.display='none';
      document.querySelector('header .login').style.display = 'block';
    }
}

// 유저 정보 불러오는 함수
function getUserInfo(token){
    const getUserInfo_URL= 'http://localhost:8000/account/auth/userInfo/'; 

    // 백엔드 측으로부터 유저 정보 불러오는 함수 
    axios({
        method: 'get',
        url: getUserInfo_URL,
        headers: { 
            'Authorization':  JSON.stringify({'Authorization': `Bearer ${token}`})
        }
    })
    .then(response => {
        // 요청이 성공하면 이 부분이 실행됩니다.
        document.querySelector('.header-link h3').textContent = `${response.data['data']['user_name']}님 안녕하세요`; 
        document.querySelector('header .logout').style.display = 'block';
    })
    .catch(error => {
        console.log('error : ', error);
    });
}

var boardURL= 'http://localhost:8000/board/';
var boardCreateURL= 'http://localhost:8000/board/create/';
var myInfoURL = `http://127.0.0.1:8000/account/auth/userInfo/`;
var typeURL=`http://localhost:8000/board/questionTypeList/`;

var token = JSON.parse(localStorage.getItem('accessToken')).accessToken;
const config = {
    headers: {
        'Authorization': JSON.stringify({'Authorization': `Bearer ${token}`})
    }
}

axios.get(typeURL).then(
(response) => {
    const typeData = response.data.type_list;
    const typeSelect = document.getElementById("exampleSelect");

    typeData.forEach(function (type) {
        const option = document.createElement("option");
        option.value = type.question_type_id;
        option.text = type.question_type_title;
        typeSelect.appendChild(option);
    });
});
  

var myInfoData;
axios.get(myInfoURL, config)
.then((response) => {
    myInfoData = response;
})
.catch((error) => {
    console.log(error)
})

function writeBoard() {
    var formData = new FormData();

    var question_type = document.getElementById("exampleSelect").value;
    var title = document.getElementById("inputBoardTitle").value;
    var content = document.getElementById("inputBoardContent").value;
    var image = document.getElementById("imageFile").files[0];

    formData.append('question_type_id', question_type);
    formData.append('question_title', title);
    formData.append('question_content', content);

    if (image !== null) {
        formData.append('image', image);
    } else {
        formData.append('image', none);
    }    
    console.log(question_type)
    if (title === '' || content === '') {
        Toast.fire({
            width: '500px',
            icon: 'error',
            title: '글과 내용을 모두 작성해주세요!'
        });
    }

    else if (title.length > 30) { 
        Toast.fire({
            width: '500px',
            icon: 'error',
            title: '제목은 30자 이내로 작성해주세요!'
        });
    }

    else if (content.length > 100) {
        Toast.fire({
            width: '500px',
            icon: 'error',
            title: '내용은 100자 이내로 작성해주세요!'
        });
    }
    
    else if (title.length > 30 || content.length > 100) {
        Toast.fire({
            width: '500px',
            icon: 'error',
            title: '제목은 30자, 내용은 100자 이내로 작성해주세요!'
        });
    }
    
    else {
        axios.post(boardCreateURL, formData, config)
        .then((response) => {
            console.log('success');
            Toast.fire({
                width: '420px',
                icon: 'success',
                title: '작성이 완료되었습니다.'
            });
            setTimeout(function() {
                window.location.href = '../inquiryBoard.html';   
            }, 900)
        })
        .catch((error) => {
            Toast.fire({
                width: '420px',
                icon: 'error',
                title: '오류가 발생했습니다. 다시 시도해주세요.'
            });
            setTimeout(function() {
                location.reload();
            }, 900);
        })
    }    

    
}

function goInquiryBoard(){
    window.location.href='../inquiryBoard.html';
}

