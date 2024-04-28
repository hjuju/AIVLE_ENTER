// inquiryBoard.html을 불러왔을 떄 로그인 여부를 판별한다.
window.addEventListener('DOMContentLoaded', (event) => {
    console.log('새로고침');

    checkLoginStatusAndUpdateUI();
});


const currentId = window.location.search.substring(4);
var boardDetaildUrl = `http://127.0.0.1:8000/board/` + currentId + `/`;
var myInfoURL = `http://127.0.0.1:8000/account/auth/userInfo/`;
var editBoardURL = `http://127.0.0.1:8000/board/` + currentId + `/post_update_post/`;
var deleteBoardURL = `http://127.0.0.1:8000/board/` + currentId + `/delete/`;

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

// 전역 변수
let user_role = 'user';
let user_id = '';

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
        // 요청이 성공하면 이 부분이 실행됩니다.
        console.log('성공:', response.data); // 로그에 응답 데이터를 찍습니다.

        user_name=response.data['data']['user_name'];  // 이름을 가져온다.
        user_role=response.data.data.role;
        user_id=response.data.data.user_id;
        document.querySelector('.header-link h3').textContent = `${user_name}님 안녕하세요!!`; // h3 태그에 보여준다.
        document.querySelector('header .logout').style.display = 'block';
        boardDetail(boardDetaildUrl);
    })
    .catch(error => {
        alert('에러');
    });
}


const token = getWithExpire('accessToken'); // 토큰을 받아온다.
const config = {
    headers: {
        'Authorization': JSON.stringify({'Authorization': `Bearer ${token}`})
    }
}
function boardDetail(boardDetaildUrl) {
    axios.get(boardDetaildUrl)
        .then((response) => {
            var inquiryData = response.data;
            console.log(inquiryData);
            
            var faqItemType = document.querySelector('.faqItem-type');
            var faqItemTitle = document.querySelector('.faqItem-title');
            var faqItemWriter = document.querySelector('.faqItem-writer');
            var faqItemContent = document.querySelector('.faqItem-content');
            var faqItemImage = document.querySelector('.faqItem-image');

            faqItemType.append(inquiryData['question_type_title']);
            faqItemTitle.append(inquiryData['question_title']);
            faqItemWriter.append(inquiryData['user_name']);
            faqItemContent.append(inquiryData['question_content']);

            // 답변이 아직 없고 & 관리자일 경우에만 답변하기 버튼 보여주기
            if(user_role=='admin' & inquiryData['answer_content']==null) {
                document.querySelector(".reply-button").style.display='block';        
            }

            // 작성자일 경우에만 수정, 삭제 버튼 보여주기
            if(user_id==inquiryData['user_id']) {
                document.querySelector(".edit-button").style.display='block';
                document.querySelector(".delete-button").style.display='block';
            } else if(user_role=='admin') {
                // 관리자일 경우 삭제버튼 보여주기
                document.querySelector(".delete-button").style.display='block';
            }

            // 답변이 이미 있는 경우 수정 버튼 숨기기 
            if(inquiryData['answer_content'] != null) {
                document.querySelector(".edit-button").style.display='none';
            }
            
            var imageDownloadLink = document.createElement("a");
            imageDownloadLink.className = 'attached-file';
            imageDownloadLink.style.marginLeft = "20px";
            imageDownloadLink.href = inquiryData['question_image_file'];
            imageDownloadLink.target = '_blank';
            imageDownloadLink.download = 'Temp Name';
            
            function decode(x) {

                y = decodeURIComponent(x.replace(/\+/g,  " "));
                return y
            }

            if (inquiryData['question_image_file'] != null & inquiryData['question_image_file'] != "") {
                var llist = inquiryData['question_image_file'].split('/')
                len = llist.length;
                imageDownloadLink.textContent = decode(llist[len-1]);
                faqItemImage.appendChild(imageDownloadLink);
            }

            // 답변 보여주기
            if (inquiryData['answer_content'] != null) {
                document.getElementById('answer-area').style.display = 'block';
                document.getElementById('answer-area').textContent  = inquiryData['answer_content'];
            }
            
        })
        .catch((error) => {
            console.log(error);
        })
}

// 답변 모달창
const answer_modal = document.getElementById('answer-modal');
function replyButton() {
    if (user_role == 'user') {
        Toast.fire({
            width: '420px',
            icon: 'error',
            title: '권한이 없습니다.'
        });
    } else {
        answer_modal.style.display = 'block';
    }
}
// 모달 닫기 버튼 클릭 시 이벤트 처리
const closeModalAnswer = document.getElementById('closeModalAnswer');
closeModalAnswer.addEventListener('click', function () {
    answer_modal.style.display = 'none';
});

// 모달 바깥 영역 클릭 시 모달 닫기
window.addEventListener('click', function (event) {
    if (event.target === answer_modal) {
        answer_modal.style.display = 'none';
    }
});
// 답변 하는 함수
function answer() {
    var answerURL = `http://localhost:8000/board/${currentId}/answer_create`;
    var answer_content = document.getElementById("answer_content").value;
    console.log(answer_content);

    if(answer_content.trim()=="") {
        Toast.fire({
            width: '420px',
            icon: 'error',
            title: '답변을 입력해주세요.'
        });
        return false;
    }

    // 백엔드 측으로부터 유저 정보 불러오는 통신(Rest Api)
    axios({
        method: 'post',
        url: answerURL,
        headers: { 
            'Authorization':  JSON.stringify({'Authorization': `Bearer ${token}`})
        },
        data: {
            post_id: currentId,
            answer_content: answer_content
        }
    })
    .then(response => {
        // 요청이 성공하면 이 부분이 실행됩니다.
        console.log('성공:', response.data); // 로그에 응답 데이터를 찍습니다.
        if(response.data.success==true) {
            Toast.fire({
                width: '420px',
                icon: 'success',
                title: '답변이 작성되었습니다.'
            });
            setTimeout(function() {
                location.reload();
            }, 900);
        } else {
            Toast.fire({
                width: '420px',
                icon: 'error',
                title: '답변은 관리자만 작성할 수 있습니다.'
            });
            setTimeout(function() {
                location.reload();
            }, 900);
        }
    })
    .catch(error => {
        Toast.fire({
            width: '420px',
            icon: 'error',
            title: '오류가 발생했습니다. 다시 시도해주세요.'
        });
        setTimeout(function() {
            location.reload();
        }, 900);
    });
}


function editButton() {
    const title = document.querySelector(".faqItem-title");
    const content1 = document.querySelector(".faqItem-content");
    const category = document.querySelector(".faqItem-type");
    const replybutton = document.querySelector(".reply-button");
    const editbutton = document.querySelector(".edit-button");
    const deletebutton = document.querySelector(".delete-button");
    const buttonsection = document.querySelector(".button-section");
    const itembox = document.querySelector(".faqItem-box");
    const imagep = document.querySelector(".attached-file");
    console.log(imagep);

    var typeURL=`http://localhost:8000/board/questionTypeList/`;
    var editURL = 
    replybutton.remove();
    editbutton.remove();
    deletebutton.remove();

    const completeeditbutton = document.createElement("button");
    const cancelbutton = document.createElement("button");
    completeeditbutton.className = "custombutton"
    completeeditbutton.textContent = '수정완료';
    cancelbutton.textContent = '취소';
    cancelbutton.type = 'button';
    cancelbutton.className = 'custombutton';

    buttonsection.appendChild(completeeditbutton);
    buttonsection.appendChild(cancelbutton);

    const categoryedit = document.createElement("select");

    cat = category.textContent;

    axios.get(typeURL).then(
        (response) => {
            const typeData = response.data.type_list;
        
            typeData.forEach(function (type) {
                const option = document.createElement("option");
                option.value = type.question_type_id;
                option.text = type.question_type_title;
                if (option.text==cat){
                    option.selected = true;
                }
                categoryedit.appendChild(option);
            });
        });

    category.textContent = '';
    category.appendChild(categoryedit);

    // const contentedit = document.createElement("textarea");
    // contentedit.className = 'faqItem-content';
    // contentedit.style.cssText = 'width : 100%; border:none; resize:none'
    // contentedit.textContent = content.textContent;

    const titleedit = document.createElement("textarea");
    titleedit.className = 'faqItem-title';
    titleedit.style.cssText = 'width : 100%; border:none; resize:none; background-color:transparent'
    titleedit.textContent = title.textContent.trim();

    //content.textContent = '';
    title.textContent = '';
    //content.appendChild(contentedit);
    title.appendChild(titleedit);
    content1.readOnly=false;
    titleedit.rows = 1;

    if (imagep){
        imagep.textContent = "기존파일";
    }
    filediv = document.createElement('div')
    filediv.style.cssText = "text-align: right;"
    filediv.className = "file-detach";
    filep = document.createElement('p');
    filep.textContent = '파일을 새로 첨부하려면 파일을 선택하세요.';
    fileinput = document.createElement('input');
    fileinput.type = "file";
    fileinput.id = 'imageFile';
    filediv.appendChild(filep);
    filediv.appendChild(fileinput);
    itembox.appendChild(filediv);

    const editcomplete = () =>{
        var formData = new FormData();
        var question_type = categoryedit.value;
        console.log(question_type);
        var title = titleedit.value;
        var content = content1.value;
        var image = document.getElementById("imageFile").files[0];

        formData.append('question_type_id', question_type);
        formData.append('question_title', title);
        formData.append('question_content', content);
        if (image !== null) {
            formData.append('image', image);
        } else {
            formData.append('image', none);
        }
        if (question_type == '문의 유형 선택' || title === null || content === null) {
            Toast.fire({
                width: '420px',
                icon: 'error',
                title: '글의 제목과 내용 모두 작성해 주세요!'
            });
            setTimeout(function() {
                location.reload();
            }, 900);
        } else {
            axios.post(editBoardURL, formData, config)
            .then((response) => {
                console.log('success');
                Toast.fire({
                    width: '420px',
                    icon: 'success',
                    title: '수정이 완료되었습니다.'
                });
                setTimeout(function() {
                    location.reload();
                }, 900);
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
    };

    const cancel = () =>{
        window.location.reload();
    };

    cancelbutton.onclick = cancel;
    completeeditbutton.onclick = editcomplete;
}

function deleteButton() {
    Swal.fire({
        title: '정말 삭제하시겠습니까?',
        text: "삭제한 데이터는 복구할 수 없습니다!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#454997',
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
    }).then((result) => {
        if (result.isConfirmed) {
            // 실제 동작 수행
            axios.post(deleteBoardURL, {}, config)
            .then((response) => {
                Toast.fire({
                    width: '420px',
                    icon: 'success',
                    title: '삭제되었습니다.'
                });
                setTimeout(function() {
                    window.location.href = '../inquiryBoard.html';   
                }, 900);
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
            });
        }
    });
}

function goInquiryDetail(){ // '목록' 버튼을 클릭했을 떄 다시 inquiryBoard.html로 Routing 한다.
    window.location.href='inquiryBoard.html';
}