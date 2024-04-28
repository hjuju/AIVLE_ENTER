//calllback으로 받은 검색어
search = new URL(window.location.href).searchParams.get('search');
if(search != null) {
    document.getElementById("search").value = search;
}

// inquiryBoard.html을 불러왔을 떄 로그인 여부를 판별한다.
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

// 유저 정보를 불러오는 함수 
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
        console.log('성공:', response.data); 

        user_name=response.data['data']['user_name'];                                       // 이름을 가져온다.
        document.querySelector('.header-link h3').textContent = `${user_name}님 안녕하세요`; // h3 태그에 보여준다.
        document.querySelector('header .logout').style.display = 'block';
    })
    .catch(error => {
        console.log('error : ', error);
    });
}




const getUserInfo_URL= 'http://localhost:8000/account/auth/userInfo/';  // 백엔드 소통 URL
const token = getWithExpire('accessToken');                             // 토큰을 받아온다.

var pageNumber = 1;
var totalPage = 1;

defaultUrl = 'http://127.0.0.1:8000/board/?page='; // ?page=2 이런식으로 페이지 넣어서 보내야 함
function pageRendering(page_num) {
    var renderUrl = defaultUrl + page_num;
    if(search != null) {
        renderUrl += `&keyword=${search}`
    }

    axios.get(renderUrl)
    .then((response) => {
        console.log('success');
        totalPage = Math.ceil(response['data']['tot_post'] / 10);
        console.log('total:', totalPage);

        var board_list = response.data['post_list'];
        empty()
        var totalBoardCount = document.querySelector('.aside');
        totalBoardCount.append('총 ' + response['data']['tot_post'] + '개의 게시물이 있습니다.');


        var htmlhead = document.createElement('thead');
        htmlhead.innerHTML = `<tr>
                                <th>번호</th>
                                <th>문의유형</th>
                                <th>제목</th>
                                <th>글쓴이</th>
                                <th>작성일시</th>
                             </tr>`
        document.getElementById('boardList').appendChild(htmlhead);

        var tmpContentNumber = 1 + (page_num - 1) * 10;



        board_list.forEach((content) => {
            htmlItem = document.createElement('tbody');
            
            htmlItem.innerHTML = `<td>${content.number}</td>
                                    <td>${content.question_type_title}</td>
                                    <td style="cursor: pointer;" onclick="handleQuestionTitleClick(${content.board_id})">${content.question_title}</td>
                                    <td>${content.user_name}</td>
                                    <td>${content.question_datetime.substr(0, 10)}</td>`;
            document.getElementById('boardList').appendChild(htmlItem);
        });

        pageNumbering()

    })
    .catch((error) => {
        console.log(`error: ${error}`);
    })
}

function prevPage() {
    if (pageNumber > 1) {
        pageNumber--;
        pageRendering(pageNumber);
    }
}

function postPage() {
    if (pageNumber < totalPage) {
        pageNumber++;
        pageRendering(pageNumber)
    }
}

function empty() {
    var tmp1 = document.querySelector('.aside');
    var tmp2 = document.querySelector('#boardList');
    var tmp3 = document.querySelector('#pageNumber');

    tmp1.innerHTML = '';
    tmp2.innerHTML = '';
    tmp3.innerHTML = '';
}

function pageNumbering() {
    tmpHTML = document.getElementById('pageNumber');

    var prevSpan = document.createElement('span');
    var postSpan = document.createElement('span');
    prevSpan.innerHTML = '<a href="javascript:void(0);" onclick="prevPage()">◀ 이전&nbsp;&nbsp;</a>';
    postSpan.innerHTML = '<a href="javascript:void(0);" onclick="postPage()">&nbsp;&nbsp다음 ▶</a>';

    tmpHTML.appendChild(prevSpan);
    console.log(totalPage)
    for (var i=0; i<totalPage; i++) {
        var pageSpan = document.createElement('span');
        pageSpan.innerHTML = `<a href="javascript:void(0);" onclick="pageRendering(${i+1})">&nbsp;&nbsp;${i+1}&nbsp;&nbsp;</a>`;
        tmpHTML.appendChild(pageSpan);
    }
    tmpHTML.appendChild(postSpan);
}

function redirectToDetailPage(postId) {
    window.location.href = '/inquiryDetail.html?id=' + postId;
}

function handleQuestionTitleClick(questionId) {
    redirectToDetailPage(questionId);
}


pageRendering(pageNumber);