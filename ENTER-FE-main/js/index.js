// 전역 변수
let user_id; // 사용자 id 
let token;   // 토큰 

// index.html을 불러왔을 떄 로그인 여부를 판별한다.
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
        getUserInfo();

        // 백엔드 코드를 이용해서 채팅방 목록 보여오기
        getChatRoomList();
    } 
    // 비로그인 상태이면?
    else {
        document.querySelector('header .login').style.display = 'block';
        // 'sidebar'에는 이렇게 화면을 그려준다.
        document.getElementById('sidebar').innerHTML = `
            <div style="height: calc(100vh - 50px); padding:10px; display: flex; flex-direction: column; justify-content: center;">
                <h2 style='font-weight: 100; text-align:center;'>로그인 후 <span style="color: #454997; font-weight: bold;">ENTER</span>를<span style='display:inline-block;margin-top:7px;'>마음껏 활용하세요</span></h2>
        
                <div style='margin-top: 350px; width: 100%; border-bottom: 1px solid black;'></div>

                <div style='margin-top:20px;'>
                    <a href="../enter_introduction.html" 
                       style="text-decoration: none; color: black; display: block; margin-bottom: 20px;">
                        <img src="assets/img/what_enter.png" 
                             style="width: 20px; height: 20px; vertical-align: middle; margin-bottom:3px; margin-right: 5px;">
                        엔터란?
                    </a>
                    <a href="../signin.html"
                       style="text-decoration: none; color: black; display: block;">
                        <img src="assets/img/login_out.png" 
                             style="width: 20px; height: 20px; vertical-align: middle; margin-bottom:3px; margin-right: 5px;">
                        로그인
                    </a>
                </div>
            </div>
        `;

        // 'main -> new-chat-view'에 이렇게 화면을 그려준다.
        const newChatView = document.querySelector('.new-chat-view');
        newChatView.innerHTML = "<p style='margin-top:80px; text-align: center; height:40.5px; font-size:20px; font-weight:bold;'><span style='display:inline-block;margin-bottom:8px;'>간단하고 손쉬운 프롬프트 사용으로</span><br><span>손쉽게<span style='color: #454997;'> 경쟁력</span>을 키워보세요</</p>";

        // 'main -> conversation-view'에는 이렇게 화면을 그려준다.
        const conversationView = document.querySelector('.view.conversation-view');
        conversationView.style.overflowY = 'scroll';
        conversationView.style.display = 'flex';  
        conversationView.style.alignItems = 'center'; 

        // 질문과 대답 데이터 5쌍
        const questionsAndAnswers = [
            {
                question: "KT 인터넷에 대한 사용자들의 평가는 어떤지 알려줘 !",
                answer: '전반적으로 KT 인터넷에 대한 의견은 긍정적인 경향을 보입니다. 가격, 서비스 품질, 평가 등 다양한 측면에서 KT 인터넷이 좋다는 의견이 많이 나타났습니다. 그러나 일부 지역에 따라 3통신사 인터넷의 차이가 있을 수 있다는 의견도 있습니다. 따라서 전체적으로 KT 인터넷이 양호하다고 평가되지만, 개별적인 지역에 따라 상이할 수 있다는 점을 고려해야 합니다.',
            },
            {
                question: "kt 기가지니에 대한 긍정적인 댓글 3개를 보여줘 !",
                answer: `
"KT 기가지니는 집 안에서 편리하게 일상을 관리할 수 있게 해주는 최고의 스마트 가전 제품 중 하나에요. 음악 재생부터 일정 관리까지 다양한 기능을 한 곳에서 간편하게 사용할 수 있어 정말 편리해요!"
                
"기가지니의 음성인식 기술이 정말 뛰어나서, 명령을 내리면 바로 반응해주는 점이 정말 인상적입니다. 이렇게 편리한 가전 제품을 사용하니 일상 생활이 훨씬 더 효율적으로 되는 것 같아요."
                
"KT 기가지니의 AI 기술은 계속 발전하고 있어서, 사용할 때마다 새로운 기능과 업데이트로 더 많은 편의성을 느낄 수 있어요. 미래를 대비해서 이런 스마트한 기기를 도입한 건 정말 좋은 선택이었습니다!"`,
            },
            {
                question: "kt 인터넷과 관련하여 ‘기술 지원 부족’에 대해 어떤 리뷰들이 있는지 보여줘 !",
                answer: `
kt인터넷에서 기술지원부족에 대한 이야기를 다음과 같은 리뷰들이 있습니다.

1. 내용: 인터넷은 kt인듯, 날짜: 2023-10-02 18:29 
2. 내용: 인터넷 문제 맞았네 나도 kt 쓰는데 kt가 문제가 많은건가..?, 날짜: 2023-08-12 22:05 
3. 내용: Kt인터넷문제..?, 날짜: 2023-08-06 04:30
4. 내용: 요즘 kt 인터넷이 문제 많다는 소리 때문에 상대적 올려치기인듯, 날짜: 2023-11-08 13:00

이 리뷰들은 kt인터넷의 기술지원이 부족하다는 내용을 언급하고 있습니다.`,
            },
            {
                question: "'카페달'에 대한 긍정적인 평가에 대해 알려줘 !",
                answer: '카페달에 대한 긍정적인 댓글들은 대부분 카페의 아늑한 분위기와 포근함을 강조하고 있으며, 카이막과 커피의 맛을 함께 즐기는 것을 추천하고 있습니다. 이러한 긍정적인 평가와 추천은 해당 카페가 고객들에게 만족스러운 경험을 제공하고 있음을 시사합니다. 따라서, 해당 카페는 카이막과 커피의 맛으로 인해 사람들에게 인기가 있고, 아늑한 분위기와 좋은 서비스로 인해 계속해서 방문하고자 하는 고객들의 관심을 얻고 있을 것으로 예상됩니다.',
            },
            {
                question: "'카페달'에 대한 개선점과 관련된 리뷰를 3개 보여줘 !",
                answer: `
"서비스 속도가 아직 개선이 필요해요. 주문 후 음료를 받는 데 시간이 조금 걸리는 편이에요. 바쁜 시간대에는 손님들이 기다리는 동안 조금 불편해하는 모습이 보였어요. 음료 제조나 서빙 속도를 높이기 위한 프로세스 개선이 필요해 보입니다."

"메뉴 다양성이 부족해요. 카페 메뉴가 다소 한정적으로 느껴졌어요. 특히 비건이나 다양한 식이 제약이 있는 손님들을 위한 옵션이 부족한 편이었습니다. 다양성 있는 메뉴 개발로 더 많은 고객들을 유치할 수 있을 것 같아요."

"인테리어 개선이 필요해 보입니다. 카페 분위기는 좋았지만, 좀 더 현대적이고 트렌디한 인테리어로 업데이트할 필요가 있어 보였어요. 고객들이 편안하게 머무르고 즐길 수 있는 분위기 조성이 중요할 것 같아요."`,
            },
        ];

        // 질문과 대답 데이터 5쌍을 이용하여 질문 div와 대답 div를 생성한다.
        for(let i = 0; i < questionsAndAnswers.length; i++){
            // 질문 div 생성
            const questionDiv = document.createElement('div');
            questionDiv.style.width = '80%';                        // 질문 div width
            questionDiv.style.backgroundColor = '#F7F6FF';          // 질문 배경색
            questionDiv.style.color = '#3B3F4E';                    // 질문 텍스트 색
            questionDiv.style.padding = '10px';   
            questionDiv.style.margin = '10px 0 0 0';                // 위쪽 마진
            questionDiv.style.borderRadius = '8px';                 // 모서리 외곽선 둥글게
            questionDiv.style.display = 'flex';                     // flexbox 사용
            questionDiv.style.flexDirection = 'column';             // 아이콘과 텍스트를 위아래로 정렬
            questionDiv.style.alignItems = 'flex-start';            // 텍스트를 왼쪽 정렬

            // '사람' 아이콘 추가
            const userIcon = document.createElement('i');
            userIcon.className = 'material-icons';                  // Material Icons 클래스
            userIcon.textContent = 'person';                        // 사용자 아이콘
            userIcon.style.color = 'black';                         // 아이콘 색상을 검정색으로 설정
            userIcon.style.marginBottom = '10px';                   // 아이콘과 텍스트 간격 조절
            userIcon.style.cursor = 'default';                      // 마우스 커서를 기본으로 설정

            questionDiv.appendChild(userIcon);                      // 아이콘을 div에 추가

            // 질문 텍스트 추가
            const questionText = document.createElement('span');
            questionText.innerHTML = '<br>' + questionsAndAnswers[i].question;
            questionText.style.padding = '10px';                    // 패딩 추가
            questionDiv.appendChild(questionText);                  // 질문 텍스트를 div에 추가

            // 대답 div 생성
            const answerDiv = document.createElement('div');
            answerDiv.style.width = '80%';                          // 대답 영역 width
            answerDiv.style.backgroundColor = '#F2F7FF';            // 대답 배경색
            answerDiv.style.color = '#3B3F4E';                      // 대답 텍스트 색깔
            answerDiv.style.padding = '10px';
            answerDiv.style.margin = '10px 0 40px 0';               // 위쪽 마진 및 하단 마진 증가
            answerDiv.style.borderRadius = '8px';                   // 모서리 외곽선 둥글게
            answerDiv.style.display = 'flex';                       // flexbox 사용
            answerDiv.style.flexDirection = 'column';               // 아이콘과 텍스트를 위아래로 정렬
            answerDiv.style.alignItems = 'flex-start';              // 텍스트를 왼쪽 정렬

            // 이미지 추가
            const enterImage = document.createElement('img');
            enterImage.src = 'assets/img/ENTR_logo.png';            // ENTER 이미지 파일 경로
            enterImage.style.height = '24px';                       // 이미지 높이 조절

            // 대답 텍스트 추가
            const answerText = document.createElement('span');
            answerText.innerHTML = '<br>' + questionsAndAnswers[i].answer;
            answerText.style.padding = '10px';                      // 패딩 추가
            answerText.style.marginTop = '10px';                    // 텍스트 위쪽 마진 추가
            answerText.style.whiteSpace = 'pre-wrap';               // 대답 줄 바꿈

            // 'edit Icon'을 배치한 div 생성
            const editIconDiv = document.createElement('div');
            editIconDiv.style.marginTop = '10px';                   // edit 아이콘 위쪽 마진 추가
            editIconDiv.style.marginLeft = 'auto';                  // 오른쪽 정렬

            // 'edit Icon' 추가
            const span = document.createElement('span');
            
            // 이미지 태그 생성
            const img = document.createElement('img');
            img.src = 'assets/img/memo_icon.png';                     // 이미지의 URL을 설정하세요.
            img.alt = '메모 아이콘';                                  // 이미지에 대한 대체 텍스트를 설정하세요.
            img.width = 22;                                          // 너비를 22px로 설정
            img.height = 22;                                         // 높이를 22px로 설정                       
                            
            span.appendChild(img);                                   // span 요소에 이미지를 추가합니다.
            span.style.cursor = 'default';                           // 마우스 커서를 기본으로 설정

            // 대답(A) 하단 오른쪽 '연필 아이콘' 클릭 이벤트
            span.onclick = function() {
                // 보기 용도이므로 굳이 이벤트가 발생할 필요가 없다.
            };

            editIconDiv.appendChild(span);                           // 아이콘을 div에 추가

            answerDiv.appendChild(enterImage);                       // 이미지를 div에 추가
            answerDiv.appendChild(answerText);                       // 대답 텍스트를 div에 추가
            answerDiv.appendChild(editIconDiv);                      // edit 아이콘을 div에 추가

            // 질문, 아이콘 및 대답 div를 conversation view에 추가
            conversationView.appendChild(questionDiv);
            conversationView.appendChild(answerDiv);
        }
    }
}

// 유저 정보 불러오는 함수
function getUserInfo(){
    const getUserInfo_URL= 'http://localhost:8000/account/auth/userInfo/';  // 백엔드 소통 URL

    // 백엔드측으로부터 유저 정보 불러오는 통신(Rest-Api)
    axios({
        method: 'get',
        url: getUserInfo_URL,
        headers: { 
            'Authorization':  JSON.stringify({'Authorization': `Bearer ${token}`})
        }
    })
    .then(response => {
        user_id=response.data['data']['user_id'];                                                              // 아이디를 가져온다.
        document.querySelector('.header-link h3').textContent = `${response.data.data.user_name}님 안녕하세요`; // h3 태그에 보여준다.
        document.querySelector('header .logout').style.display = 'block';
    })
    .catch(error => {
        console.log(error);
    });
}

// 'New Chat' click 시 팝업 나타나는 함수 
function openPopup() {
    document.getElementById('new-chat-popup').style.display = 'flex';

    var topic = document.getElementById('topic');
    var chatRoomName = document.getElementById('chatroom-name');
    const errorMessageDiv = document.getElementById('error-message');

    topic.value='';
    chatRoomName.value='';
    errorMessageDiv.style.display = 'none';

    document.getElementById('topic').addEventListener('input', function() {
        document.getElementById('chatroom-name').value = this.value;
    });
}

// 'New Chat' - 생성 click 했을 떄 호출되는 함수
function generateChat(event) {
    event.preventDefault();                                               // 폼 제출에 의한 페이지 새로고침 방지
 
    console.log('생성하기');

    var topic=document.getElementById('topic').value;                     // 주제를 가져온다.
    var chatRoomName=document.getElementById('chatroom-name').value;      // 채팅방명을 가져온다.
    var generateChat_URL='http://localhost:8000/main/chatWindow/create/'; // 백엔드 통신 URL

    if(topic=='' || chatRoomName==''){                                    // 둘 중 하나가 빈 값일 떄 처리
        const errorMessageDiv = document.getElementById('error-message');
        errorMessageDiv.style.display = 'block';                          // 오류 메시지 요소를 보이게 설정
        errorMessageDiv.textContent='빈 값이 있습니다.';                   // 오류 메시지 설정
        return;
    }

    // 백엔드측으로부터 '채팅방 생성' 기능 통신(Rest-Api)
    axios({
        method: 'post',
        url: generateChat_URL,
        headers: { 
            'Authorization':  JSON.stringify({'Authorization': `Bearer ${token}`})
        },
        data: {
            'target': topic, 
            'title': chatRoomName,
        }
    })
    .then(response => {
        console.log('message : ', response.data.message);
        console.log('errors : ', response.data.errors);

        closePopup(); // 팝업 창을 닫음

        window.location.reload(); // 새로 고침하기
    })
    .catch(error => {
        console.error('Error :', error);

        const errorMessageDiv = document.getElementById('error-message');
        errorMessageDiv.style.display = 'block';                        // 오류 메시지 요소를 보이게 설정
        errorMessageDiv.textContent=error.response.data.message;        // 오류 메시지 설정
    });
}

// 'New Chat', '채팅방명 수정' 팝업 닫기 함수 
function closePopup() {
    document.getElementById('new-chat-popup').style.display = 'none';
    document.getElementById('update-popup').style.display = 'none';

}

// 채팅방 목록을 가져오는 함수
function getChatRoomList(){
    const getChatList_URL=`http://localhost:8000/main/`;

    // 백엔드측으로부터 채팅방 목록을 가져오는 통신(Rest-Api)
    axios({
        method: 'get',
        url: getChatList_URL,
        headers: { 
            'Authorization':  JSON.stringify({'Authorization': `Bearer ${token}`})
        }
    })
    .then(response => {
        console.log('채팅방 불러오기 성공:', response.data);                     // 로그에 응답 데이터를 찍습니다.

        // HTML에서 채팅방 목록을 담는 ul 요소를 선택하고 기존 목록을 클리어(clear) 한다.
        const conversationsElement = document.querySelector('.conversations');  
        conversationsElement.innerHTML = '';                                                 

        const chatRoomList = response.data['data']['chat_list']; // 백엔드에서 받은 채팅방 목록

        // '크롤러 설정' 섹션 요소를 찾고 chatRoomList 데이터를 저장한다.
        const crawlerSettingSection = document.querySelector(".sidebar-area .section:first-child");
        crawlerSettingSection.dataset.chatroomlist = JSON.stringify(chatRoomList); 
        
        // main 부분 중앙에 '원하는 주제로 채팅을 시작하세요' imgage를 보여준다.
        var conversationView = document.querySelector('.view.conversation-view');
        conversationView.style.padding = '40px';
        conversationView.style.height = 'calc(100vh - 50px)';

        // 중앙 정렬을 위한 컨테이너 div 생성
        var containerDiv = document.createElement('div');
        containerDiv.style.display = 'flex';                  // Flexbox 레이아웃 사용
        containerDiv.style.justifyContent = 'center';         // 수평 중앙 정렬
        containerDiv.style.alignItems = 'center';             // 수직 중앙 정렬
        containerDiv.style.height = '100%';                  // 컨테이너의 높이 설정

        // 새로운 img 요소를 생성
        var img = document.createElement('img');
        img.src = 'assets/img/chatting.png'; 
        img.alt = '설명'; 
        img.style.width='400px';  
        img.style.display = 'block'; 
        img.style.margin = 'auto'; 

        // 컨테이너 div에 img 요소 추가
        containerDiv.appendChild(img);

        // 대상 div에 컨테이너 div 추가
        conversationView.appendChild(containerDiv);

       // 채팅방이 없을 떄 
       if(chatRoomList.length==0){
            const li = document.createElement('li');
            li.textContent = '채팅방이 없습니다';
            li.style.padding='30px';
            li.style.textAlign = 'center';
            li.style.marginTop = '125px'; 
            li.style.fontSize = '1.6em'; 
            conversationsElement.appendChild(li);
       }
       // 채팅방이 있을 떄 
       else{
         // 채팅방 목록을 순회하면서 각 채팅방에 대한 HTML 요소 생성
         chatRoomList.forEach(chatRoom => {
            const li = document.createElement('li'); 

            // 채팅방 버튼 생성
            const button = document.createElement('button');
            button.className = 'conversation-button';
            button.textContent = chatRoom.title;
            button.id = chatRoom.target_object;

            // 채팅방을 클릭하면 질문과 대답으로 구성된 히스토리를 가져온다.
            button.addEventListener('click', () => getChatQaHistory(chatRoom));

            // 채팅방 수정, 삭제 아이콘 생성
            const span = document.createElement('span');
            span.className = 'material-icons';
            span.textContent = 'more_vert';
            span.style.marginLeft = '15px';
            span.style.marginTop = '15px';

            // 삼자 아이콘('|') 아이콘 클릭 시 이벤트 리스너 추가
            span.onclick = function() {         
                event.stopPropagation(); // 이벤트 버블링 방지
                   
                // 수정이나 삭제가 나오는 context-menu를 보여준다.
                const contextMenu = document.getElementById('contextMenu');
                contextMenu.style.display = 'block';
                contextMenu.setAttribute('data-chat-window-id', chatRoom.chat_window_id); 
                contextMenu.style.left = event.clientX + 'px';
                contextMenu.style.top = event.clientY + 'px';

                // 외부 클릭 시 컨텍스트 메뉴 숨기기
                document.addEventListener("click", function() {
                    document.getElementById("contextMenu").style.display = "none";
                });
            };

            // li 요소에 버튼과 삭제 아이콘 추가
            li.appendChild(button);
            li.appendChild(span);

            // ul 요소에 새로운 li 요소 추가
            conversationsElement.appendChild(li);
        });
       }
    })
    .catch(error => {
        // 오류가 발생하면 이 부분이 실행됩니다.
        alert('채팅방 불러오기 오류');
    });
}

// 채팅방에 대한 질문(Q) 대답(A)에 따른 히스토리를 가져오는 함수
function getChatQaHistory(chatRoom){
    // 모든 버튼에서 'active' 클래스 제거 
    const buttons = document.querySelectorAll('.conversation-button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    // 클릭된 버튼에 'active' 클래스 추가 -> 이 채팅방일 수 있음을 알게끔, 다른 색깔로 화면에 표시한다.
    const activeButton = document.getElementById(chatRoom.target_object);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // AI에서 제공하는 질문과 대답 쌍으로 이루어진 데이터를 가져오는 통신한다.(Rest-Api)
    const getHistory_URL=`http://127.0.0.1:8002/history/${user_id}/${chatRoom.target_object}`; // AI 소통 URL
    axios({
        method: 'get',
        url: getHistory_URL, 
    })
    .then(response => {
        console.log('질문&대답 데이터 :', response.data.conversation);
        var conversationView = document.querySelector('.view.conversation-view');
        conversationView.style.height = 'calc(100vh - 159.1px)';

        if (response.data.conversation.length > 0) {
            conversationView.style.padding = '40px 40px 0';
            document.getElementById("to-top").style.display = 'flex';
            document.getElementById("to-bottom").style.display = 'flex';
        } else {
            conversationView.style.padding = '40px';
            document.getElementById("to-top").style.display = 'none';
            document.getElementById("to-bottom").style.display = 'none';
        }

        // 화면에 표시하는 함수 호출
        displayChatQaHistory(response.data.conversation, 
                             chatRoom);   
    })
    .catch(error => {
        console.error('오류:', error);
        alert('채팅 기록을 가져오지 못했습니다.');
    });
}

// 채팅방에 대한 질문과 대답에 대한 히스토리를 화면에 보여주는 함수 
function displayChatQaHistory(QaDatas, chatRoom) {
    const conversationView = document.querySelector('.view.conversation-view');
    conversationView.style.display = 'flex';  
    conversationView.style.alignItems = 'center'; 
    conversationView.innerHTML = ''; 

    // 채팅 히스토리 이력이 없는 경우 -> main 부분에 중앙에 '원하는 주제로 채팅을 시작하세요' image를 보여준다.
    if(QaDatas.length==0){ 
        // 중앙 정렬을 위한 컨테이너 div 생성
        var containerDiv = document.createElement('div');
        containerDiv.style.display = 'flex';                      // Flexbox 레이아웃 사용
        containerDiv.style.justifyContent = 'center';             // 수평 중앙 정렬
        containerDiv.style.alignItems = 'center';                 // 수직 중앙 정렬
        containerDiv.style.height = '100%';                       // 컨테이너의 높이 설정

        // 새로운 img 요소를 생성
        var img = document.createElement('img');
        img.src = 'assets/img/chatting.png';             
        img.alt = '원하는 주제로 채팅을 시작하세요';                // 대체 텍스트를 제공합니다
        img.style.width='400px';  
        img.style.display = 'block'; 
        img.style.margin = 'auto';                                // 가로 방향으로 자동 마진 적용

        // 컨테이너 div에 img 요소 추가
        containerDiv.appendChild(img);

        // 대상 div에 컨테이너 div 추가
        conversationView.appendChild(containerDiv);
    }

    // 채팅 이력을 그려서 화면에 보여준다.
    QaDatas.forEach(QaData => { 
        // 질문 div 생성
        const questionDiv = document.createElement('div');
        questionDiv.style.width = '80%';                        // 질문 div width
        questionDiv.style.backgroundColor = '#F7F6FF';          // 질문 배경색
        questionDiv.style.color = '#3B3F4E';                    // 질문 텍스트 색깔
        questionDiv.style.padding = '10px';   
        questionDiv.style.margin = '0';                         // 위쪽 마진
        questionDiv.style.borderRadius = '8px';                 // 모서리 외곽선 둥글게
        questionDiv.style.display = 'flex';                     // flexbox 사용
        questionDiv.style.flexDirection = 'column';             // 아이콘과 텍스트를 위아래로 정렬
        questionDiv.style.alignItems = 'flex-start';            // 텍스트를 왼쪽 정렬

        // '사람' 아이콘 추가
        const userIcon = document.createElement('i');
        userIcon.className = 'material-icons';                  // Material Icons 클래스
        userIcon.textContent = 'person';                        // 사용자 아이콘
        userIcon.style.color = 'black';                         // 아이콘 색상을 검정색으로 설정
        userIcon.style.marginBottom = '10px';                   // 아이콘과 텍스트 간격 조절
        userIcon.style.cursor = 'default';                      // 마우스 커서를 기본으로 설정

        questionDiv.appendChild(userIcon);                      // 아이콘을 div에 추가

        // 질문 텍스트 추가
        const questionText = document.createElement('span');
        questionText.innerHTML = '<br>' + QaData.question;
        questionText.style.padding = '10px';                    // 패딩 추가
        questionDiv.appendChild(questionText);                  // 질문 텍스트를 div에 추가

        // 대답 div 생성
        const answerDiv = document.createElement('div');
        answerDiv.style.width = '80%';                          // 대답 영역 width
        answerDiv.style.backgroundColor = '#F2F7FF';            // 대답 배경색
        answerDiv.style.color = '#3B3F4E';                      // 대답 텍스트 색
        answerDiv.style.padding = '10px';
        answerDiv.style.margin = '10px 0 40px 0';               // 위쪽 마진 및 하단 마진 증가
        answerDiv.style.borderRadius = '8px';                   // 모서리 외곽선 둥글게
        answerDiv.style.display = 'flex';                       // flexbox 사용
        answerDiv.style.flexDirection = 'column';               // 아이콘과 텍스트를 위아래로 정렬
        answerDiv.style.alignItems = 'flex-start';              // 텍스트를 왼쪽 정렬

        // 이미지 추가
        const enterImage = document.createElement('img');
        enterImage.src = 'assets/img/ENTR_logo.png';            // ENTER 이미지 파일 경로
        enterImage.style.height = '24px';                       // 이미지 높이 조절

        // 대답 텍스트 추가
        const answerText = document.createElement('span');
        answerText.innerHTML = '<br>' + QaData.answer;
        answerText.style.padding = '10px';                      // 패딩 추가
        answerText.style.marginTop = '10px';                    // 텍스트 위쪽 마진 추가
        answerText.style.whiteSpace = 'pre-wrap';               // 대답 줄 바꿈

        // 'edit Icon'을 배치한 div 생성
        const editIconDiv = document.createElement('div');
        editIconDiv.style.marginTop = '10px';                   // edit 아이콘 위쪽 마진 추가
        editIconDiv.style.marginLeft = 'auto';                  // 오른쪽 정렬

        // 'edit Icon' 추가
        const span = document.createElement('span');
        
        // 이미지 태그 생성
        const img = document.createElement('img');
        img.src = 'assets/img/memo_icon.png'; 
        img.alt = '메모 아이콘';  
        img.width = 22; 
        img.height = 22;                       
                        
        span.appendChild(img);                                  // span 요소에 이미지를 추가합니다.
        span.style.cursor = 'pointer';                          // 마우스 오버 시 포인터 모양 변경

        // 대답(A) 하단 오른쪽 '연필 아이콘' 클릭 이벤트
        span.onclick = function() {
            checkMemo(QaData.history_id);                      // 메모를 확인한다.
        };

        editIconDiv.appendChild(span);                         // 아이콘을 div에 추가

        answerDiv.appendChild(enterImage);                     // 이미지를 div에 추가
        answerDiv.appendChild(answerText);                     // 대답 텍스트를 div에 추가
        answerDiv.appendChild(editIconDiv);                    // edit 아이콘을 div에 추가

        // 질문, 아이콘 및 대답 div를 conversation view에 추가
        conversationView.appendChild(questionDiv);
        conversationView.appendChild(answerDiv);
    });

    // 최신 채팅이 먼저 보이게끔 적용한다.
    conversationView.scrollTop = conversationView.scrollHeight;

    // 입력창도 보이게 해야 한다.
    const messageForm = document.getElementById('message-form');   // 메시지 폼을 선택합니다.
    messageForm.style.display = 'block';                           // 메시지 폼을 보이게 설정합니다.
    
    // 입력창에 있는 값은 항상 빈값 상태로 유지
    var textareaElement = document.getElementById('message');
    textareaElement.value='';

    // 하단 입력창에 있는 '전송' 버튼에 대한 참조를 얻음
    const sendButton = document.querySelector('.send-button');

    // 하단 입력창에 있는 '전송' 버튼을 click 했을 떄 
    sendButton.onclick = function() {
        // 입력한 값이 빈값인지 확인한다.
        if(document.getElementById('message').value===''){
            document.getElementById('message').value='';  
            document.getElementById('message').placeholder = '질문을 입력하고 ENTER만 치세요!'; 
            alert('빈 값 입니다.');
        }
        else{
            console.log('클릭');
            sendQuestion(chatRoom, QaDatas);                       // 질문과 대답을 추가한다.
        }
    };
    
    // 하단 입력창에 엔터(Enter) 클릭했을 때 
    messageForm.onkeydown = function(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            const messageInput = document.getElementById('message');
            e.preventDefault(); // 폼의 기본 제출 이벤트 방지

            if (messageInput.value.trim() === '') {
                alert('빈 값 입니다.');
                messageInput.value = '';
                messageInput.placeholder = '질문을 입력하고 ENTER만 치세요!';
            } 
            else {
                sendQuestion(chatRoom, QaDatas);                  // 질문과 대답을 추가한다.
            }
        }
    };

}

// 새로운 질문을 전송하는 함수
function sendQuestion(chatRoom, QaDatas) {
    // 기존에 채팅 이력이 없었다면 "원하는 주제로 채팅을 시작하세요" image 보여줬던 것을 지운다.
    if(QaDatas.length==0){
        const conversationView = document.querySelector('.view.conversation-view');
        conversationView.style.display = 'flex';                                  // display 'flex'
        conversationView.style.alignItems = 'center';                             // 모든 자식 요소를 가로축 중앙에 정렬
        conversationView.innerHTML = '';                                          // 기존에 채팅 이력을 삭제한다.
    }

    // 입력창에 적은 text를 가져온다.
    var textareaElement = document.getElementById('message');  
    var question = textareaElement.value;

    // 하단 입력창에 대한 값을 빈값으로 대치한다.
    textareaElement.value='';

    // 질문을 화면에 추가
    addQA(question,
          '#F7F6FF',
           false); 

    // 대답을 화면에 추가
    addQA('ENTER',
          '#F2F7FF',
           true);

    // 대답을 실시간으로 보여주는 함수
    generateAnswerLive(question, chatRoom);

    // 대답을 실시간으로 보여줄 떄는 사용자가 클릭 할 수 없게 '전송'하기 버튼을 비활성화 한다.
    const sendButton = document.querySelector('.send-button');
    sendButton.style.display = 'none';
}

// 대화(Q, A)에 메시지를 추가하는 함수
function addQA(message, bgColor, isAnswer) {
    const conversationView = document.querySelector('.view.conversation-view');
    const messageDiv = document.createElement('div');

    messageDiv.style.backgroundColor = bgColor;
    messageDiv.style.width='80%';
    messageDiv.style.borderRadius = '8px';
    messageDiv.style.padding = '10px';
    messageDiv.style.display = 'flex';             // Flexbox 적용
    messageDiv.style.flexDirection = 'column';     // 아이템을 수직으로 정렬
    messageDiv.style.alignItems = 'flex-start';    // 텍스트를 왼쪽 정렬

    // 대답인 경우
    if (isAnswer) {
        messageDiv.style.color = 'black';          // 텍스트 색깔 
        messageDiv.style.margin = '10px 0 40px 0'; // 위쪽 마진 및 하단 마진 증가

        // 이미지 추가
        const enterImage = document.createElement('img');
        enterImage.src = 'assets/img/ENTR_logo.png';
        enterImage.style.height = '24px';

        // 대답 텍스트 추가
        const answerText = document.createElement('span');
        answerText.id = 'answer-text';              // ID 설정
        answerText.innerHTML = '<br>';              // 대답 텍스트 직접 지정
        answerText.style.padding = '10px';          // 패딩 추가
        answerText.style.display = 'block';         // 블록 레벨 요소로 만들기
        answerText.style.marginTop = '10px';        // 상단 여백 추가
        answerText.style.whiteSpace = 'pre-wrap';   // 대답 텍스트 줄바꿈

        messageDiv.appendChild(enterImage);
        messageDiv.appendChild(answerText);
    } 
    // 질문인 경우
    else {
        messageDiv.style.color = '#3B3F4E';         // 텍스트 색깔
        messageDiv.style.margin = '10px 0 0 0';     // 위쪽 마진만 적용

        // '사람' 아이콘 추가
        const userIcon = document.createElement('i');
        userIcon.className = 'material-icons';
        userIcon.textContent = 'person';
        userIcon.style.color = 'black';            // 아이콘 색상을 검정색으로 설정
        userIcon.style.marginBottom = '10px';

        messageDiv.appendChild(userIcon);

        // 질문 텍스트 추가
        const questionText = document.createElement('span');
        questionText.innerHTML = '<br>' + message;
        questionText.style.padding = '10px'; 
        messageDiv.appendChild(questionText);
    }

    // 질문과 대답에 대한 마진 적용
    messageDiv.style.marginBottom = isAnswer ? '40px' : '0';

    conversationView.appendChild(messageDiv);
}

// 대답(A)을 실시간으로 보여주는 함수
const generateAnswerLive = (question, chatRoom) => {
    const answerLiveResponse_URL = `http://127.0.0.1:8002/answer/${user_id}/${chatRoom.target_object}/True`;  
    const conversationView = document.querySelector('.view.conversation-view');

    // AI에서 구현한 '대답을 실시간으로 보내주는 기능'을 받아와서 대답 실시간 스트리밍을 보여준다.
    fetch(answerLiveResponse_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
           question: question,
        }),
       })
        .then((response) => {
          console.log(response);

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
  
          const readChunk = () => {
            //console.log(reader.read().value)
            return reader.read().then(appendChunks);
          };
  
          const appendChunks = (result) => {
            console.log('appendchunks')
            const chunk = decoder.decode(result.value || new Uint8Array(), {
              stream: !result.done,
            });

            const parseData = chunk;
            console.log(parseData);

            // ID를 사용하여 해당 answerText 요소 선택하여 일일히 텍스트를 더한다.
            const answerTextElement = document.getElementById('answer-text');
            answerTextElement.innerHTML += parseData;
  
            if (!result.done) {
              return readChunk();
            }
          };
  
          return readChunk();
        })
        .then(() => {
             // 최신 질문과 대답을 볼 수 있도록 자동적으로 아래로 스크롤한다.
            conversationView.scrollTop = conversationView.scrollHeight; 

            // 하단 입력창에 대한 '전송' 버튼을 활성화 한다.
            const sendButton = document.querySelector('.send-button');
            sendButton.style.display = 'block'; // 버튼 표시

            // 1초 (1000 밀리초) 후에 실행할 코드 또는 함수
            setTimeout(function() {
                 // 채팅 이력을 다시 불러온다.
                 getChatQaHistory(chatRoom);
            }, 1000); 
           
        })
        .catch((e) => {
            console.log('error');
            console.log(e);
            
            // 하단 입력창에 대한 '전송' 버튼을 활성화 한다.
            const sendButton = document.querySelector('.send-button');
            sendButton.style.display = 'block'; 

            // 1초 (1000 밀리초) 후에 실행할 코드 또는 함수
            setTimeout(function() {
                // 채팅 이력을 다시 불러온다.
                getChatQaHistory(chatRoom);
            }, 1000);

        });
};

// 대답(R)에 대한 'edit Icon'을 클릭했을 떄 메모가 있는지 확인하는 함수
function checkMemo(history_id) {
    console.log('history_id : ', history_id);
    const getMemo_URL= `http://localhost:8000/main/memo/detail/?memo_id=${history_id}`; // 백엔드 소통 URL

    // 백엔드 측으로부터 '메모 불러오기' 기능을 통신한다.(Rest-Api)
    axios({
        method: 'get',
        url: getMemo_URL, 
        headers: { 
            'Authorization': JSON.stringify({'Authorization': `Bearer ${token}`}),
        },
    })
    .then(response => {
        console.log('성공:', response);
        
        // 메모가 있으면 사용자가 입력했었던 메모를 보여주고 수정, 삭제 버튼을 클릭할 수 있도록 한다.
        if(response.data.data.is_memo===true){
            showMemo(history_id,
                          true,
                          response.data.data.memo.memo_content);
        }
        // 메모가 없으면 빈 메모를 보여주고 저장 버튼을 클릭할 수 있도록 한다.
        else{
            showMemo(history_id, 
                          false);
        }
    })
    .catch(error => {
        console.log('에러 : ', error);
       
    });
}

// 메모를 보여주는 함수
function showMemo(history_id, flag, txt = '') {
    // 오버레이 생성
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '999';

    // 팝업 컨테이너 생성
    const popupContainer = document.createElement('div');
    popupContainer.id = 'memoPopup';
    popupContainer.style.position = 'fixed';
    popupContainer.style.left = '50%';
    popupContainer.style.top = '50%';
    popupContainer.style.transform = 'translate(-50%, -50%)';
    popupContainer.style.backgroundColor = 'white';
    popupContainer.style.padding = '30px';
    popupContainer.style.borderRadius = '8px';
    popupContainer.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.1)';
    popupContainer.style.maxWidth = '500px';
    popupContainer.style.width = '80%';
    popupContainer.style.boxSizing = 'border-box';
    popupContainer.style.zIndex = '1000';

    // 닫기 버튼 생성
    const closeButton = document.createElement('span');
    closeButton.textContent = '×'; 
    closeButton.className = 'close-button';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '30px'; 
    closeButton.style.fontWeight = 'bold'; 

    // 닫기 버튼 클릭 이벤트
    closeButton.onclick = function() {
        document.body.removeChild(popupContainer);
        document.body.removeChild(overlay);
    };

    // 팝업 타이틀 생성
    const popupTitle = document.createElement('h2');
    popupTitle.textContent = '메모';
    popupTitle.style.marginBottom = '30px';
    popupTitle.style.color = '#333';
    popupTitle.style.textAlign = 'center';

    // 메모 입력을 위한 textarea 생성
    const memoInput = document.createElement('textarea');
    memoInput.style.width = '100%';
    memoInput.style.height = '150px';
    memoInput.style.marginBottom = '10px';
    memoInput.style.boxSizing = 'border-box';
    memoInput.style.border = '1px solid #333'; 
    memoInput.style.fontFamily='scd'; 
    memoInput.style.resize = 'none';
    memoInput.style.padding = '15px';
    memoInput.style.borderRadius = '5px';
    memoInput.placeholder='메모를 입력해주세요';


    // 버튼 컨테이너 생성 및 스타일 설정
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';

    // 메모가 있을 경우
    if (flag) {
        memoInput.value = txt; // 기존 메모 내용으로 대치한다.

        // 수정 버튼 생성 및 추가
        const editButton = document.createElement('button');
        editButton.textContent = '수정';
        editButton.style.marginLeft = '10px';
        editButton.style.fontFamily='scd';
        editButton.style.backgroundColor='#454997';
        editButton.style.color= 'white'; 

        editButton.onclick = function() {   // 수정 버튼을 클릭했을 떄 메모를 수정한다.
            const updatedMemo = memoInput.value;
            updateMemo(history_id, updatedMemo);
        };

        // 삭제 버튼 생성 및 추가
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '삭제';
        deleteButton.style.marginLeft = '10px';
        deleteButton.style.fontFamily='scd'; 
        deleteButton.style.backgroundColor='#454997'; 
        deleteButton.style.color= 'white'; 

        deleteButton.onclick = function() {  // 삭제 버튼을 클릭했을 떄 메모를 삭제한다.
            deleteMemo(history_id);
        };

        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);
    }
    // 메모가 없을 경우
    else {
        // 저장하기 버튼 생성 및 추가
        const saveButton = document.createElement('button');
        saveButton.textContent = '저장';
        saveButton.style.fontFamily='scd'; 
        saveButton.style.backgroundColor='#454997'; 
        saveButton.style.color= 'white'; 

        saveButton.onclick = function() {   // 저장 버튼을 클릭했을 떄 메모를 저장한다.
            const memoContent = memoInput.value;
            if (memoContent === '') {
                alert('메모 내용을 입력해야 합니다.');
            } 
            else {
                saveMemo(history_id, memoContent);
            }
        };

        buttonContainer.appendChild(saveButton);
    }

    // 팝업에 닫기, 타이틀, textarea, 버튼 컨테이너 추가
    popupContainer.appendChild(closeButton);
    popupContainer.appendChild(popupTitle);
    popupContainer.appendChild(memoInput);
    popupContainer.appendChild(buttonContainer);

    // 팝업을 body에 추가
    document.body.appendChild(overlay);
    document.body.appendChild(popupContainer);

    // 팝업 외부 클릭 시 닫기 이벤트 처리
    window.onclick = function(event) {
        if (event.target === overlay) {
            document.body.removeChild(popupContainer);
            document.body.removeChild(overlay);
        }
    };
}

// 메모를 저장하는 함수
function saveMemo(history_id, memoContent){
    // 백엔드측으로부터  '메모 작성하기' 기능과 통신(Rest-Api)
    const writeMemo_URL=`http://localhost:8000/main/memo/create/`;
    axios({
        method: 'post',
        url: writeMemo_URL, 
        headers: { 
            'Authorization': JSON.stringify({'Authorization': `Bearer ${token}`}),
        },
        data : {'memo_id': history_id, 
                'memo_content': memoContent},
        
    })
    .then(response => {
        console.log('성공:', response);

        // 메모 팝업을 없앤다.
        closeMemo();
    })
    .catch(error => {
        console.log('에러 에러 : ', error);
        alert('에러');
    });
}

// 메모를 수정하는 함수
function updateMemo(history_id, memoContent){
    const updateMemo_URL=`http://localhost:8000/main/memo/update/`;

    // 메모 내용이 빈값인 경우
    if(memoContent==''){  
        alert('빈값을 입력하셨습니다.');
    }
    else{
        // 백엔드 측으로부터 '메모 수정하기' 기능과 통신(Rest-Api)
        axios({
            method: 'post',
            url: updateMemo_URL, 
            headers: { 
                'Authorization': JSON.stringify({'Authorization': `Bearer ${token}`}),
            },
            data : {'memo_id': history_id, 
                    'memo_content': memoContent},
        })
        .then(response => {
            console.log('성공:', response);
    
            // 메모 팝업을 없앤다.
            closeMemo();
        })
        .catch(error => {
            console.log('에러 에러 : ', error);
            alert('에러');
        });
    }
}

// 메모를 삭제하는 함수
function deleteMemo(history_id){
    // 정말 삭제할건지 묻기
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
            // 백엔드 측으로부터 '메모 삭제하기' 기능과 통신(Rest-Api)
            const deleteMemo_URL=`http://localhost:8000/main/memo/delete/`;
            axios({
                method: 'post',
                url: deleteMemo_URL, 
                headers: { 
                    'Authorization': JSON.stringify({'Authorization': `Bearer ${token}`}),
                },
                data : {'memo_id': history_id}
            })
            .then(response => {
                console.log('성공:', response);

                // 메모 팝업을 없앤다.
                closeMemo();
            })
            .catch(error => {
                console.log('에러 에러 : ', error);
                alert('에러');
            });
        }
    });
}

// 메모 팝업을 닫는 함수
function closeMemo() {
    const overlay = document.getElementById('overlay');
    const popupContainer = document.getElementById('memoPopup');
    if (overlay) {
        document.body.removeChild(overlay);        // 오버레이 제거
    }
    if (popupContainer) {
        document.body.removeChild(popupContainer); // 팝업 컨테이너 제거
    }
}

// context에서 '수정'을 클릭했을 떄 호출되는 함수
function modify(){
    var contextMenu=document.getElementById("contextMenu");
    var chatWindowId=contextMenu.getAttribute('data-chat-window-id');
    var update_popup=document.getElementById('update-popup');

    // 채팅방 제목을 수정하는 팝업을 띄운다.
    update_popup.style.display = 'flex';
    update_popup.setAttribute('data-chat-window-id', chatWindowId); 

    // 채팅방 제목을 빈값으로 만든다.
    var form = document.getElementById('update-chat-form');
    form.elements['chatroom-name'].value = '';

    // 혹시 오류 메시지가 있으면 빈칸으로 설정한다.
    var form = document.getElementById('update-chat-form');
    var errorMessageDiv = form.querySelector('#error-message');
    errorMessageDiv.textContent='';
}

// 채팅방 수정하는 팝업에서 수정 button click 했을 떄 호출되는 함수
function editChatRoom(){
    event.preventDefault(); // 새로고침 방지

    var contextMenu = document.getElementById('update-popup');
    var chatWindowId = contextMenu.getAttribute('data-chat-window-id');

    var form = document.getElementById('update-chat-form');
    var chatroomName = form.elements['chatroom-name'].value;

    const editChatRoom_URL='http://localhost:8000/main/chatWindow/update/';

    // 백엔드 측으로부터 구현한 '채팅방 수정' 기능을 통신(Rest-Api)
    axios({
        method: 'post',
        url: editChatRoom_URL,
        headers: { 
            'Authorization':  JSON.stringify({'Authorization': `Bearer ${token}`})
        },
        data: {
           'chat_window_id':chatWindowId, 
            'title': chatroomName,
        }
    })
    .then(response => {
        console.log('성공!!');

        document.getElementById('update-popup').style.display = 'none';   // 팝업을 숨김

        window.location.reload(); // 새로 고침
    })
    .catch(error => {
        console.log(`에러 : ${error.response.data.message}`);

        // 폼 요소 가져오기
        var form = document.getElementById('update-chat-form');

        // 폼 내의 오류 메시지 요소에 접근
        var errorMessageDiv = form.querySelector('#error-message');

        // 에러 메시지를 보여준다.
        errorMessageDiv.style.display='block';
        errorMessageDiv.textContent=error.response.data.message;
    });
}

// 채팅방을 삭제할 떄 함수
function deleteChatRoom(){
    // 정말 삭제할건지 묻기
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
            var contextMenu=document.getElementById("contextMenu");
            var chatWindowId=contextMenu.getAttribute('data-chat-window-id');
            const deleteChatRoom_URL='http://localhost:8000/main/chatWindow/delete/'; // 백엔드 소통 URL

            // 백엔드 측으로부터 구현한 '채팅방 삭제' 기능을 통신(Rest-Api)
            axios({
                method: 'post',
                url: deleteChatRoom_URL,
                headers: { 
                    'Authorization':  JSON.stringify({'Authorization': `Bearer ${token}`})
                },
                data: {
                'chat_window_id': chatWindowId,
                }
            })
            .then(response => {
                console.log('성공!!');

                window.location.reload(); // 새로 고침
            })
            .catch(error => {
                console.log(`에러 : ${error.response.data.message}`);
            });
        }
    });
}

// '엔터란?'를 클릭하면 Routing 하는 함수
function question_enter(){
    window.location.href='../enter_introduction.html';
}

// 버튼
crawlerBtn = document.getElementById("crawler");
promptBtn = document.getElementById("prompt");
reportBtn = document.getElementById("report");
modelSelectionBtn = document.getElementById("modelSelection");
frequentUseBtn = document.getElementById("frequentUse");

// 'AI 설정'을 click하면 호출되는 함수
function AIconfig() {
    document.querySelector(".settings-img").style.display = 'block';

    // 버튼 
    crawlerBtn.classList.remove("active");
    promptBtn.classList.remove("active");
    reportBtn.classList.remove("active");
    modelSelectionBtn.classList.remove("active");
    frequentUseBtn.classList.remove("active");

    var modal = document.getElementById("myModal");  // 모달창 
    var isModalOpen = modal.style.display === "block";

    // modal.style.display==='block'일 떄 (Model 화면을 나가려고 할 떄 )
    if (isModalOpen) {     
        modal.style.display="none";

        removeBlurFromElements();
    } 
    // modal.style.display==='none'일 떄  (Model 화면으로 들어왔을 떄 )
    else {                
        modal.style.display = "block";

        document.querySelector(".popup1-content").style.display='none';
        document.querySelector(".popup2-content").style.display='none';
        document.querySelector(".popup3-content").style.display='none';
        document.querySelector(".popup4-content").style.display='none';
        document.querySelector(".message-btn-group").style.display='none';
        document.querySelector(".popup5-content").style.display='none';
        
        applyBlurToElements();
    }
}

// 모달을 제외한 주요 요소에 블러 효과 적용 하는 함수
function applyBlurToElements() {
    // 모달을 제외한 주요 요소에 블러 효과 적용
    document.querySelector('header').classList.add('blur-effect');
    document.querySelector('#sidebar').classList.add('blur-effect');
    document.querySelector('main').classList.add('blur-effect');
}

// 모든 요소에서 블러 효과를 제거하는 함수 
function removeBlurFromElements() {
    // 모든 요소에서 블러 효과 제거
    document.querySelector('header').classList.remove('blur-effect');
    document.querySelector('#sidebar').classList.remove('blur-effect');
    document.querySelector('main').classList.remove('blur-effect');
}

// 모달 창에서 '크롤러 설정'을 click 했을 떄 호출되는 함수 
function handleCrawlerClick() {
    // 이미지
    document.querySelector(".settings-img").style.display = 'none';

    // 버튼 
    crawlerBtn.classList.add("active");
    promptBtn.classList.remove("active");
    reportBtn.classList.remove("active");
    modelSelectionBtn.classList.remove("active");
    frequentUseBtn.classList.remove("active");

    document.querySelector(".content-area").style.display ="flex";
    document.querySelector(".content-area").style.alignItems ="center";
    document.querySelector(".content-area").style.justifyContent ="center";

    // '크롤러 설정' 섹션에서 data-chatroomlist 속성을 가져온다.
    const crawlerSettingSection = document.querySelector(".sidebar-area .section:first-child");
    const chatRoomList = JSON.parse(crawlerSettingSection.dataset.chatroomlist);

    var popup2_content = document.querySelector(".popup2-content");
    popup2_content.style.display = 'none'; // '프롬프트 설정' 콘텐츠는 display None

    var popup3_content = document.querySelector(".popup3-content");
    popup3_content.style.display = 'none'; // '리포트 설정' 콘텐츠는 display None

    var popup4_content = document.querySelector(".popup4-content");
    popup4_content.style.display = 'none';    // '자주 쓰는 문구' 콘텐츠는 display None
    var messageBtnGroup = document.querySelector(".message-btn-group");
    messageBtnGroup.style.display = 'none';

    var popup5_content = document.querySelector(".popup5-content");
    popup5_content.style.display = 'none';    // '모델 설정' 콘텐츠는 display None

    var popup1_content = document.querySelector(".popup1-content");
    popup1_content.innerHTML = '';
    popup1_content.style.display = 'flex';
    popup1_content.style.flexDirection = 'column';
    popup1_content.style.justifyContent = 'center';
    popup1_content.style.alignItems = 'center';

    // 버튼 스타일
    var buttonStyle = 'background-color: #454997; color: #FFFFFF; margin: 10px; padding: 10px 20px; border: none; cursor: pointer; width: 160px; height: 50px; text-align:center; font-family: scd';

    // '대상 설정' 버튼 생성 및 스타일링
    var targetSettingButton = document.createElement('button');
    targetSettingButton.textContent = '대상 설정';
    targetSettingButton.style.cssText = buttonStyle;
    targetSettingButton.onclick = function() {                 // '대상 설정' button을 click 했을 떄 
        targetSetting(chatRoomList);                           // '대상 설정'에 대한 팝업을 띄운다.
    };
    popup1_content.appendChild(targetSettingButton);

    // '수집 현황' 버튼 생성 및 스타일링
    var collectionStatusButton = document.createElement('button');
    collectionStatusButton.textContent = '수집 현황';
    collectionStatusButton.style.cssText = buttonStyle;
    collectionStatusButton.onclick = function() {              // '수집 현황' button을 click 했을 떄 
        collectStatus(chatRoomList);                           // '수집 현황'에 대한 팝업을 띄운다.
     };
    popup1_content.appendChild(collectionStatusButton);

    // '크롤러 템플릿 설정' 버튼 생성 및 스타일링
    var crawlerTemplateSettingButton = document.createElement('button');
    crawlerTemplateSettingButton.textContent = '크롤러 템플릿 설정';
    crawlerTemplateSettingButton.style.cssText = buttonStyle;
    crawlerTemplateSettingButton.onclick = function() {        // '크롤러 템플릿 설정' button을 click 했을 떄 
        crawlerTemplateSetting();                              // '크롤러 템플릿 설정'에 대한 팝업을 띄운다.
    };
    popup1_content.appendChild(crawlerTemplateSettingButton);
}

// 모달 창 '크롤러 설정' - '대상 설정'을 click 했을 떄 호출되는 함수 
function targetSetting(chatRoomList) {
    // 팝업 div 생성
    var popup = document.createElement('div');
    popup.style.width = '400px';
    popup.style.height = '300px';
    popup.style.backgroundColor = 'white';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.border = '1px solid black';
    popup.style.padding = '20px';
    popup.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.5)';
    popup.style.zIndex = 1000;
    popup.style.display = 'flex';
    popup.style.flexDirection = 'column';
    popup.style.justifyContent = 'space-around';

    // '수집 대상' 텍스트
    var collectionTargetText = document.createElement('h3');
    collectionTargetText.textContent = '수집 대상';
    popup.appendChild(collectionTargetText);

    // 동적으로 생성한 드롭다운 메뉴
    var dropdown = document.createElement('select');
    dropdown.style.width = '100%';
    dropdown.style.border = '1px solid #000000';
    dropdown.style.fontFamily = 'scd'; 
    dropdown.style.padding = '5px'; 
    dropdown.style.borderRadius = '5px';


    // chatRoomList 길이가 0이면?
    if (chatRoomList.length === 0) {
        alert("채팅방을 만들어야 수집할 수 있습니다.");
        return; 
    }

    // chatRoomList를 이용하여 드롭다운 옵션을 동적으로 생성
    chatRoomList.forEach(chatRoom => {
        var option = document.createElement('option');
        option.value = chatRoom.target_object;                                // 채팅방의 고유 ID
        option.textContent = chatRoom.target_object + ' | ' + chatRoom.title; // 드롭다운에 이렇게 표시한다.
        dropdown.appendChild(option);
    });

    popup.appendChild(dropdown);

    // 버튼 컨테이너
    var buttonContainer = document.createElement('div');
    buttonContainer.style.width = '100%';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end'; 
    buttonContainer.style.alignItems = 'flex-end'; 
    

    // '수집시작' 버튼
    var startButton = document.createElement('button');
    startButton.textContent = '수집시작';
    startButton.style.marginRight = '10px';
    startButton.style.fontFamily='scd';  
    startButton.style.backgroundColor='#454997'; 
    startButton.style.color= 'white'; 
    startButton.onclick = function() { // '수집시작' 버튼을 click 했을 떄 
        // AI 측으로부터 주제에 대한 크롤러 수집을 할 수 있도록 한다.
        axios({
            method: 'get',
            url: `http://localhost:8002/start_crawl/${user_id}/${dropdown.options[dropdown.selectedIndex].value}`,
        })  
        .then(response => {
            alert('수집 시작을 합니다.');
            console.log('수집 완료: ', response);
        
            // 나가기
            document.body.removeChild(popup); 
        })
        .catch(error => {
            alert('오류가 발생했습니다.');
            console.log('에러');
            console.error(error); // 오류 로그
        });
    };
    buttonContainer.appendChild(startButton);

    // '나가기' 버튼
    var exitButton = document.createElement('button');
    exitButton.textContent = '나가기';
    exitButton.style.fontFamily='scd';  
    exitButton.style.backgroundColor='#454997'; 
    exitButton.style.color= 'white'; 
    exitButton.onclick = function() {       // 나가기 버튼을 click 했을 떄 
        document.body.removeChild(popup);   // 나가기
    };
    buttonContainer.appendChild(exitButton);

    // 버튼 컨테이너를 팝업에 추가
    popup.appendChild(buttonContainer);

    // 팝업을 body에 추가
    document.body.appendChild(popup);
}

// 모달 창 '크롤러 설정' - '수집 현황'을 click 했을 떄 호출되는 함수
function collectStatus(chatRoomList) {
    // 채팅방이 없으면 수집하는 alert 문구를 띄우고 더이상 진행하지 못하게 한다.
    if (chatRoomList.length === 0) { 
        alert("채팅방을 만들어야 수집할 수 있습니다.");
        return;
    }

    // AI 측으로부터 수집 현황 데이터를 받는 통신한다.(Rest-Api)
    axios({
        method: 'post',
        url: `http://localhost:8002/crawl_data/${user_id}/${chatRoomList[0].target_object}`,
    })  
    .then(response => {    
        // 첫번쨰 드롭다운, 두번쨰 드롭다운, 나가기 버튼을 담는 div 영역을 마련한다.
        var popup = document.createElement('div');
        popup.style.width = '400px';
        popup.style.height = 'auto'; // 높이 자동 조절
        popup.style.backgroundColor = 'white';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.border = '1px solid black';
        popup.style.padding = '20px';
        popup.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.5)';
        popup.style.zIndex = 1000;
        popup.style.display = 'flex';
        popup.style.flexDirection = 'column';
        popup.style.justifyContent = 'space-around';

        // div 영역 내 첫 번째 드롭다운 설정
        var firstDropdownText = document.createElement('h4');
        firstDropdownText.textContent = '수집된 대상 설정';
        popup.appendChild(firstDropdownText);

        var firstDropdown = document.createElement('select');
        firstDropdown.style.width = '80%';
        firstDropdown.style.height = '25px';
        firstDropdown.style.border = '1px solid #000000';
        firstDropdown.style.fontFamily='scd'; 

        // 드롭다운마다 채팅방의 target_object와 title을 저장한 메뉴를 보여준다.
        chatRoomList.forEach(chatRoom => { 
            var option = document.createElement('option');
            option.value = chatRoom.target_object;
            option.title = chatRoom.title;
            option.textContent = chatRoom.target_object + ' | ' + chatRoom.title;
            firstDropdown.appendChild(option);
        });

        popup.appendChild(firstDropdown);

        // 첫 번째 드롭다운의 선택 변경 이벤트 처리
        firstDropdown.onchange = function() {
            var selectedOption = firstDropdown.options[firstDropdown.selectedIndex]; // 현재 선택된 옵션

            // AI 측으로부터 axios로 해당 드롭다운 메뉴의 user_id와 target_object를 활용해 요청 통신(Rest-Api)
            axios({
                method: 'post',
                url: `http://localhost:8002/crawl_data/${user_id}/${selectedOption.value}`,
            })
            .then(response => {
                console.log('성공 : ', response);

                // data가 있는지 없는지 확인하여 2번째 드롭다운 메뉴에 포함한다.
                if(response.data.status==false){
                    // 기존 두 번쨰 드롭다운에 있었던 메뉴를 지운다.
                    secondDropdown.innerHTML='';

                    var option = document.createElement('option');
                    option.value = '수집된 데이터가 없습니다.'; 
                    option.textContent = '수집된 데이터가 없습니다.';
                    secondDropdown.appendChild(option);

                    resultTextArea.value = '결과를 확인할 수 없습니다.';
                }
                else {
                    // 기존 두 번쨰 드롭다운에 있었던 메뉴를 지운다.
                    secondDropdown.innerHTML='';

                    // 데이터를 받아와서 두 번쨰 드롭다운 메뉴에 추가한다.
                    for (var key in response.data) {
                        if (response.data.hasOwnProperty(key)) {
                            var option = document.createElement('option');
                            option.value = response.data[key]; // 값으로 설정
                            option.textContent = key; // 키를 텍스트로 설정
                            secondDropdown.appendChild(option);
                        }
                    }

                    // '조회 결과' 텍스트에 이렇게 대치한다.
                    resultTextArea.value = '수집된 데이터는 ' + secondDropdown.options[secondDropdown.selectedIndex].value + '건 입니다.';
                }
            })
            .catch(error => {
                alert('오류가 발생했습니다.');
                console.log('에러');
                console.error(error); // 오류 로그
            }); 
        };

        // '데이터 선택' 드롭다운 text
        var secondDropdownText = document.createElement('h4');
        secondDropdownText.textContent = '데이터 선택';
        popup.appendChild(secondDropdownText);

        var secondDropdown = document.createElement('select');
        secondDropdown.style.width = '80%';
        secondDropdown.style.border = '1px solid #000000';
        secondDropdown.style.fontFamily='scd';  // 글꼴 설정
        
        popup.appendChild(secondDropdown);

        // AI 측에서 받아온 데이터 길이를 판별하여 두 번째 드롭다운 메뉴 생성
        if(response.data.status==false){
            // 기존 두 번쨰 드롭다운에 있었던 메뉴를 지운다.
            secondDropdown.innerHTML='';

            // 두 번쨰 드롭다운에 '수집된 데이터가 없습니다.' 문구 추가
            var option = document.createElement('option');
            option.value = '수집된 데이터가 없습니다.'; 
            option.textContent = '수집된 데이터가 없습니다.';
            secondDropdown.appendChild(option);
        }
        else {
            // 기존 두 번쨰 드롭다운에 있었던 메뉴를 지운다.
            secondDropdown.innerHTML='';

            // 데이터를 받아와서 두 번쨰 드롭다운 메뉴에 추가한다.
            for (var key in response.data) {
                if (response.data.hasOwnProperty(key)) {
                    var option = document.createElement('option');
                    option.value = response.data[key];    // 값으로 설정
                    option.textContent = key;             // 키를 텍스트로 설정
                    secondDropdown.appendChild(option);
                }
            }
        }
        popup.appendChild(secondDropdown);

        // 두 번째 드롭다운의 선택 변경 이벤트 처리
        secondDropdown.onchange = function() {
            // '조회 영역' 텍스트에 이렇게 배치한다.
            resultTextArea.value = '수집된 데이터는 ' + secondDropdown.options[secondDropdown.selectedIndex].value + '건 입니다.';
        };

        // '조회 결과' 표시 영역
        var resultTitle = document.createElement('h4');
        resultTitle.textContent = '조회 결과';
        resultTitle.style.display = 'block';
        resultTitle.style.marginTop = '20px';
        resultTitle.style.fontFamily='scd';  
        popup.appendChild(resultTitle);


        var resultTextArea = document.createElement('textarea');
        resultTextArea.style.display = 'block';

        resultTextArea.value = (response.data.status == false)  
                              ? '결과를 확인할 수 없습니다.'
                              : '수집된 데이터는 ' + secondDropdown.options[secondDropdown.selectedIndex].value + '건 입니다.';

        resultTextArea.style.marginTop = '5px';
        resultTextArea.style.border = 'none';  
        resultTextArea.style.padding = '10px';
        resultTextArea.style.wordWrap = 'break-word'; 
        resultTextArea.style.fontFamily = 'scd';  
        resultTextArea.readOnly = true;  
        resultTextArea.style.resize = 'none';
        popup.appendChild(resultTextArea);


        // '나가기' 버튼을 담는 컨테이너 설정
        var buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.width = '100%';
        buttonContainer.style.marginTop = '20px';

        // '나가기' 버튼
        var exitButton = document.createElement('button');
        exitButton.textContent = '나가기';
        exitButton.style.background = '#FFFFFF';
        exitButton.style.backgroundColor='#454997'; 
        exitButton.style.color= 'white'; 
        exitButton.style.padding = '10px 20px';
        exitButton.style.border = '1px solid black';
        exitButton.style.cursor = 'pointer';
        exitButton.style.marginLeft = '10px';
        exitButton.style.fontFamily='scd';  
        exitButton.onmouseover = function() {        // '나가기' 버튼에 mouse를 가까이 둘 떄 
            this.style.backgroundColor = '#454997';
            this.style.color = '#FFFFFF'; 
        };
        exitButton.onmouseout = function() {         // '나가기' 버튼에 mouse를 땟을 떄 
            this.style.backgroundColor = '#FFFFFF'; 
            this.style.color = '#000000'; 
        };
        exitButton.onclick = function() {            // '나가기' 버튼을 click 했을 떄 
            document.body.removeChild(popup);        // 나가기
        };
        buttonContainer.appendChild(exitButton);

        // 버튼 컨테이너를 팝업에 추가
        popup.appendChild(buttonContainer);

        // 팝업을 body에 추가
        document.body.appendChild(popup);
    })
    .catch(error => {
        alert('오류가 발생했습니다.');
        console.log('에러');
        console.error(error); // 오류 로그
    });
}

// 
// 모달 창 '크롤러 설정' - '크롤러 템플릿 설정'을 click 했을 떄 호출되는 함수
function crawlerTemplateSetting() {
    // AI 측으로부터 크롤러 템플릿 설정 정보를 가져오는 통신(Rest-Api)
    const templateLoad_URL=`http://localhost:8002/load_template/${user_id}/llama/crawl`;
    axios({
        method: 'get',
        url: templateLoad_URL,
    })
    .then(response => {
        console.log('템플릿 로드 완료 :', response);

        // 보여주기 
        var popup = document.createElement('div');
        popup.style.width = '800px';
        popup.style.height = '600px';
        popup.style.backgroundColor = 'white';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.border = '1px solid black';
        popup.style.padding = '20px';
        popup.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.5)';
        popup.style.zIndex = 1000;
        popup.style.display = 'flex';
        popup.style.flexDirection = 'column';
        popup.style.justifyContent = 'space-between';

        // '회사 정보 설정' 텍스트
        var companyInfoText = document.createElement('h4');
        companyInfoText.textContent = '회사 정보 설정';
        popup.appendChild(companyInfoText);

        // 회사 정보 입력칸
        var companyInfoInput = document.createElement('textarea');
        companyInfoInput.type = 'text';
        companyInfoInput.value = response.data.company_info.length < 6 ? response.data.company_info_default : response.data.company_info;  
        companyInfoInput.style.width = '100%';
        companyInfoInput.style.height = '120px';
        companyInfoInput.style.border = '1px solid black'; 
        companyInfoInput.style.resize = 'none';
        companyInfoInput.style.fontFamily = 'scd'; 
        popup.appendChild(companyInfoInput);

        // '타켓 정보 설정' 텍스트
        var targetInfoText = document.createElement('h4');
        targetInfoText.textContent = '타켓 정보 설정';
        popup.appendChild(targetInfoText);

        // 타켓 정보 입력칸
        var targetInfoInput = document.createElement('textarea');
        targetInfoInput.type = 'text';
        targetInfoInput.value = response.data.product_info.length < 6 ? response.data.product_info_default : response.data.product_info;   
        targetInfoInput.style.height = '240px';
        targetInfoInput.style.border = '1px solid black'; 
        targetInfoInput.style.resize = 'none'; 
        targetInfoInput.style.fontFamily = 'scd'; 
        popup.appendChild(targetInfoInput);

        // 버튼 컨테이너
        var buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.width = '100%';
        buttonContainer.style.marginTop = '10px';

        // '초기화' 버튼 
        var resetButton = document.createElement('button');
        resetButton.textContent = '초기화';
        resetButton.style.marginRight = '10px';
        resetButton.style.fontFamily='scd';  
        resetButton.style.backgroundColor='#454997'; 
        resetButton.style.color= 'white'; 
        resetButton.onclick = function() { // '초기화' 버튼을 click 했을 떄 
            // 입력란의 값을 기본값으로 재설정합니다.
            companyInfoInput.value = response.data.company_info_default;
            targetInfoInput.value = response.data.product_info_default;
        };
        buttonContainer.appendChild(resetButton);

        // '적용' 버튼
        var applyButton = document.createElement('button');
        applyButton.textContent = '적용';
        applyButton.style.marginRight = '10px';
        applyButton.style.fontFamily='scd';  
        applyButton.style.backgroundColor='#454997'; 
        applyButton.style.color= 'white'; 
        applyButton.onclick = function() {
            // AI 측으로부터  크롤러 템플릿을 적용하는 통신(Rest-Api)
            const templateEdit_URL=`http://localhost:8002/edit_template/${user_id}/llama/crawl`;
            axios({
                method: 'post',
                url: templateEdit_URL,
                data : {
                    'template_config' : {
                        'company_info' : companyInfoInput.value,
                        'product_info' : targetInfoInput.value,
                    }
                }
            })
            .then(response => {
                alert('크롤러 템플릿 적용이 완료되었습니다.');
                console.log('템플릿 적용 완료 : ', response);
            
                // 나가기
                document.body.removeChild(popup); 
            })
            .catch(error => {
                alert('오류가 발생했습니다.');
                console.log('에러');
                console.error(error); // 오류 로그
            });
        };
        buttonContainer.appendChild(applyButton);

        // '나가기' 버튼
        var exitButton = document.createElement('button');
        exitButton.textContent = '나가기';
        exitButton.style.fontFamily='scd';  
        exitButton.style.backgroundColor='#454997'; 
        exitButton.style.color= 'white'; 
        exitButton.onclick = function() {       // '나가기' 버튼을 click 했을 떄 
            document.body.removeChild(popup);  // 나가기
        };
        buttonContainer.appendChild(exitButton);

        // 버튼 컨테이너를 팝업에 추가
        popup.appendChild(buttonContainer);

        // 팝업을 body에 추가
        document.body.appendChild(popup);   
    })
    .catch(error => {
        alert('오류가 발생했습니다.');
        console.log('에러');
        console.error(error); // 오류 내용
    });
}

// 모달 창에서 '프롬프트 설정'을 click 했을 떄 호출되는 함수
function handlePromptClick(){
    // 이미지
    document.querySelector(".settings-img").style.display = 'none';

    // 버튼
    crawlerBtn.classList.remove("active");
    promptBtn.classList.add("active");
    reportBtn.classList.remove("active");
    modelSelectionBtn.classList.remove("active");
    frequentUseBtn.classList.remove("active");

    document.querySelector(".content-area").style.display = "block";
    
    // AI 측으로부터 프롬프트 설정과 같은 정보를 가져오는 통신(Rest-Api)
    axios({
        method: 'get',
        url: `http://localhost:8002/load_template/${user_id}/chatgpt/conversation`,
    }).then(response => {
        console.log('성공 : ', response);

        console.log('길이 : ', response.data.condense.length);

        var popup1_content = document.querySelector(".popup1-content");
        popup1_content.style.display = 'none';    // '크롤러 설정' 콘텐츠는 display None

        var popup3_content = document.querySelector(".popup3-content");
        popup3_content.style.display = 'none';    // '레포트 설정' 콘텐츠는 display None

        var popup4_content = document.querySelector(".popup4-content");
        popup4_content.style.display = 'none';    // '자주 쓰는 문구' 콘텐츠는 display None
        var messageBtnGroup = document.querySelector(".message-btn-group");
        messageBtnGroup.style.display = 'none';

        var popup5_content = document.querySelector(".popup5-content");
        popup5_content.style.display = 'none';    // '모델 설정' 콘텐츠는 display None

        var popup2_content = document.querySelector(".popup2-content");
        popup2_content.innerHTML='';              // 다시 빈 내용으로 설정한다.
        popup2_content.style.display = 'block';   // 팝업 내용을 표시합니다.

        // '프롬프트 설정' 텍스트
        var promptNameText = document.createElement('h4');
        promptNameText.textContent = '프롬프트 설정';
        promptNameText.style.marginLeft='75px';
        popup2_content.appendChild(promptNameText);

        // '프롬프트 설정' 입력 칸 
        var promptNameInput = document.createElement('textarea');
        promptNameInput.type = 'text';
        promptNameInput.value = response.data.system.length < 6 ? response.data.system_default : response.data.system; 
        promptNameInput.style.width = '80%';
        promptNameInput.style.height = '200px';
        
        promptNameInput.style.margin = '0 auto';
        promptNameInput.style.display = 'block'; 
        promptNameInput.style.resize='none';
        promptNameInput.style.fontFamily = 'scd'; 

        popup2_content.appendChild(promptNameInput);

        // Divider 선
        var divider = document.createElement('hr');
        divider.style.border = '1px solid #ccc'; 
        divider.style.margin = '20px 20px'; 

        popup2_content.appendChild(divider);
        
        // 'condense 설정' 텍스트
        var condenseNameText = document.createElement('h4');
        condenseNameText.textContent = '출력 프롬프트 설정';
        condenseNameText.style.marginLeft='75px';
        popup2_content.appendChild(condenseNameText);

        // 'condense 설정' 입력 칸 
        var condenseNameInput = document.createElement('textarea');
        condenseNameInput.type = 'text';
        condenseNameInput.value = response.data.condense.length < 6 ? response.data.condense_default : response.data.condense;  
        condenseNameInput.style.width = '80%';
        condenseNameInput.style.height = '200px';
        
        condenseNameInput.style.margin = '0 auto'; 
        condenseNameInput.style.display = 'block'; 
        condenseNameInput.style.resize='none';
        condenseNameInput.style.fontFamily = 'scd'; 

        popup2_content.appendChild(condenseNameInput);

        // Divider 선
        var divider = document.createElement('hr');
        divider.style.border = '1px solid #ccc'; 
        divider.style.margin = '20px 20px'; 

        popup2_content.appendChild(divider);

        // 'Document 데이터 설정' 텍스트
        var metaDataNameText = document.createElement('h4');
        metaDataNameText.textContent = 'Document 데이터 설정';
        metaDataNameText.style.marginLeft='75px';
        popup2_content.appendChild(metaDataNameText);

        // 'Document 데이터 설정' 입력 칸
        var metaDataNameInput = document.createElement('textarea');
        metaDataNameInput.type = 'text';
        metaDataNameInput.value = response.data.document.length < 6 ? response.data.document_default : response.data.document; 
        metaDataNameInput.style.width = '80%';
        metaDataNameInput.style.height = '200px';
        
        metaDataNameInput.style.margin = '0 auto'; 
        metaDataNameInput.style.display = 'block'; 
        metaDataNameInput.style.resize='none';
        metaDataNameInput.style.fontFamily = 'scd'; 
        
        popup2_content.appendChild(metaDataNameInput);

        // 버튼 컨테이너 및 버튼들
        var buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.width = '80%';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.style.margin = '20px auto 0';

        // '초기화' 버튼 
        var resetButton = document.createElement('button');
        resetButton.textContent = '초기화';
        resetButton.style.marginRight = '10px';
        resetButton.style.fontFamily='scd';  
        resetButton.style.backgroundColor='#454997'; 
        resetButton.style.color= 'white'; 
        resetButton.onclick = function() {   // '초기화' 버튼 click 했을 떄 
            // 입력란의 값을 기본값으로 재설정합니다.
            promptNameInput.value = response.data.system_default;
            condenseNameInput.value= response.data.condense_default
            metaDataNameInput.value =  response.data.document_default;           
        };
        buttonContainer.appendChild(resetButton);

        // '적용' 버튼
        var applyButton = document.createElement('button');
        applyButton.textContent = '적용';
        applyButton.style.marginRight = '10px';
        applyButton.style.fontFamily='scd';  
        applyButton.style.backgroundColor='#454997'; 
        applyButton.style.color= 'white'; 
        applyButton.onclick = function() { // '적용' 버튼을 click 했을 떄 
            // AI 측으로부터  프롬프트 설정을 적용하는 통신(Rest-Api)
            axios({
                method: 'post',
                url: `http://localhost:8002/edit_template/${user_id}/chatgpt/conversation`,
                data : {
                    'template_config' : {
                        'system' : promptNameInput.value,
                        'condense': condenseNameInput.value,
                        'document' : metaDataNameInput.value,
                    }
                }
            })
            .then(response => {
                console.log('성공 : ', response);
                popup2_content.style.display = 'none';   // 나가기
            })
            .catch(error => {
                alert('오류가 발생했습니다.');
                console.log('에러');
                console.error(error); 
            });
        };
        buttonContainer.appendChild(applyButton);

        // '나가기' 버튼
        var exitButton = document.createElement('button');
        exitButton.textContent = '나가기';
        exitButton.style.fontFamily='scd';  
        exitButton.style.backgroundColor='#454997'; 
        exitButton.style.color= 'white'; 
        exitButton.onclick = function() {               // '나가기' 버튼 click 했을 떄 
            popup2_content.style.display = 'none';      //  나가기
        };
        buttonContainer.appendChild(exitButton);

        // 버튼 컨테이너를 팝업에 추가
        popup2_content.appendChild(buttonContainer);

    })
    .catch(error => {
        alert('오류가 발생했습니다.');
        console.log('에러');
        console.error(error); // 오류 내용
    });
}

// 모달 창에서 '레포트 설정'을 click 했을 떄 호출되는 함수 
function handleReportClick(){
    // 이미지
    document.querySelector(".settings-img").style.display = 'none';

    // 버튼
    crawlerBtn.classList.remove("active");
    promptBtn.classList.remove("active");
    reportBtn.classList.add("active");
    modelSelectionBtn.classList.remove("active");
    frequentUseBtn.classList.remove("active");

    document.querySelector(".content-area").style.display = "block";
    
    // AI 측으로부터 '리포트 템플릿', 'document 템플릿' 데이터를 가져오는 통신(Rest-Api)
    axios({ 
        method: 'get',
        url: `http://localhost:8002/load_template/${user_id}/chatgpt/report`,
    })
    .then(response => {
        console.log('레포트 불러오기 완료 :', response);

        var popup1_content = document.querySelector(".popup1-content");
        popup1_content.style.display = 'none';          // '크롤러 설정' 콘텐츠는 display None

        var popup2_content = document.querySelector(".popup2-content");
        popup2_content.style.display = 'none';         // '프롬프트 설정' 콘텐츠는 display None

        var popup4_content = document.querySelector(".popup4-content");
        popup4_content.style.display = 'none';        // '자주 쓰는 문구' 콘텐츠는 display None
        var messageBtnGroup = document.querySelector(".message-btn-group");
        messageBtnGroup.style.display = 'none';

        var popup5_content = document.querySelector(".popup5-content");
        popup5_content.style.display = 'none';        // '모델 설정' 콘텐츠는 display None

        var popup3_content = document.querySelector(".popup3-content");
        popup3_content.innerHTML='';                  // 다시 빈 내용으로 설정한다.
        popup3_content.style.display = 'block';       // 팝업 내용을 표시합니다.
 
        // '크롤러 설정' 섹션에서 data-chatroomlist 속성을 가져온다.
        const crawlerSettingSection = document.querySelector(".sidebar-area .section:first-child");
        const chatRoomList = JSON.parse(crawlerSettingSection.dataset.chatroomlist); 

        // '수집 대상' 텍스트 
        var collectionTargetText = document.createElement('h4');
        collectionTargetText.textContent = '수집 대상';
        collectionTargetText.style.marginLeft = '60px'; 
        popup3_content.appendChild(collectionTargetText);

        // 동적으로 생성한 드롭다운 메뉴
        var dropdown = document.createElement('select');
        dropdown.style.width = '40%';
        dropdown.style.height = '25px';
        dropdown.style.marginLeft = '60px'; // 여기에서 마진을 설정합니다
        dropdown.style.border = '1px solid #000000';
        dropdown.style.fontFamily = 'scd'; // font-family 스타일 추가

        // chatRoomList 길이가 0이면?
        if (chatRoomList.length === 0) {
            alert("채팅방을 만들어야 수집할 수 있습니다.");
            return; 
        }

        // chatRoomList를 이용하여 드롭다운 옵션을 동적으로 생성
        chatRoomList.forEach(chatRoom => {
            var option = document.createElement('option');
            option.value = chatRoom.target_object;                                // 채팅방의 고유 ID
            option.textContent = chatRoom.target_object + ' | ' + chatRoom.title; // 드롭다운에 이렇게 표시한다.
            dropdown.appendChild(option);
        });

        popup3_content.appendChild(dropdown);

        // 구분선
        var divider = document.createElement('hr');
        divider.style.border = '1px solid #ccc'; 
        divider.style.margin = '20px 20px 0px 10px'; 
        popup3_content.appendChild(divider);

        
        // '레포트 템플릿' 텍스트
        var templateText = document.createElement('h4');
        templateText.textContent = '레포트 템플릿';
        templateText.style.marginLeft = '60px';

        popup3_content.appendChild(templateText);

        // '레포트 템플릿' TextArea
        var templateTextArea = document.createElement('textarea');
        templateTextArea.value = response.data.prompt.length < 6 ? response.data.prompt_default : response.data.prompt; 
        templateTextArea.style.width = '80%';
        templateTextArea.style.height = '300px';
        templateTextArea.style.marginLeft = '60px';
        templateTextArea.style.resize = 'none'; 
        templateTextArea.style.fontFamily = 'scd'; 

        popup3_content.appendChild(templateTextArea);

        // 구분선
        var divider = document.createElement('hr');
        divider.style.border = '1px solid #ccc'; 
        divider.style.margin = '20px 20px'; 
        popup3_content.appendChild(divider);

        // 'Document 템플릿'
        var DocumentText = document.createElement('h4');
        DocumentText.textContent = 'Document 템플릿';
        DocumentText.style.marginLeft = '60px';
        popup3_content.appendChild(DocumentText);

        // 'Document 템플릿 TextArea'
        var DocumentTextArea = document.createElement('textarea');
        DocumentTextArea.value = response.data.document.length < 6 ? response.data.document_default : response.data.document;   
        DocumentTextArea.style.width = '80%';
        DocumentTextArea.style.height = '150px';
        DocumentTextArea.style.marginLeft = '60px';
        DocumentTextArea.style.resize = 'none'; 
        DocumentTextArea.style.fontFamily = 'scd'; 
        popup3_content.appendChild(DocumentTextArea);

        // 템플릿 저장 버튼 컨테이너
        var saveButtonContainer = document.createElement('div');
        saveButtonContainer.style.width = '80%'; 
        saveButtonContainer.style.display = 'flex';
        saveButtonContainer.style.justifyContent = 'flex-end'; 
        saveButtonContainer.style.margin = '20px auto 0';

        
        // 초기화 버튼
        var resetButton = document.createElement('button');
        resetButton.textContent = '초기화';
        resetButton.style.marginRight = '10px'; 
        resetButton.style.fontFamily='scd';  
        resetButton.style.backgroundColor='#454997'; 
        resetButton.style.color= 'white'; 
        resetButton.onclick = function() {  // '초기화' 버튼을 click 했을 떄 
             // 입력란의 값을 기본값으로 재설정합니다.
            templateTextArea.value = response.data.prompt_default;
            DocumentTextArea.value = response.data.document_default;
        };
        saveButtonContainer.appendChild(resetButton);

        // 템플릿 저장 버튼
        var saveTemplateButton = document.createElement('button');
        saveTemplateButton.textContent = '템플릿 저장';
        saveTemplateButton.style.marginRight = '10px'; 
        saveTemplateButton.style.fontFamily='scd';  
        saveTemplateButton.style.backgroundColor='#454997'; 
        saveTemplateButton.style.color= 'white'; 
        saveTemplateButton.onclick = function() { // 템플릿 저장 버튼을 click 할 떄 
            // AI 측으로부터 템플릿 저장 설정을 적용하는 통신(Rest-Api)
            axios({
                method: 'post',
                url: `http://localhost:8002/edit_template/${user_id}/chatgpt/report`,
                data : {
                    'template_config' : {
                        'prompt' : templateTextArea.value,
                        'document' : DocumentTextArea.value,
                    }
                }
            })
            .then(response => {
                alert('레포트 템플릿 설정이 완료되었습니다.'); 
                popup3_content.style.display = 'none'; // 나가기 
            })
            .catch(error => {
                alert('오류가 발생했습니다.');
                console.log('에러');
                console.error(error); // 오류 처리
            });
        };
        saveButtonContainer.appendChild(saveTemplateButton);

        // 나가기 버튼
        var exitButton = document.createElement('button');
        exitButton.textContent = '나가기';
        exitButton.style.marginRight = '10px'; 
        exitButton.style.fontFamily='scd';  
        exitButton.style.backgroundColor='#454997';
        exitButton.style.color= 'white';
        exitButton.onclick = function() {           // 나가기 버튼 click 했을 떄 
            popup3_content.style.display = 'none'; /// 팝업 닫기
        };
        saveButtonContainer.appendChild(exitButton);

        // 템플릿 저장 버튼 컨테이너를 팝업에 추가
        popup3_content.appendChild(saveButtonContainer);

        // Divider 선
        var divider = document.createElement('hr');
        divider.style.border = '1px solid #ccc'; 
        divider.style.margin = '20px 20px'; 
        popup3_content.appendChild(divider);

        // 레포트 만들기 버튼 컨테이너
        var createButtonContainer = document.createElement('div');
        createButtonContainer.style.display = 'flex';
        createButtonContainer.style.justifyContent = 'flex-end';
        createButtonContainer.style.width = '80%'; 
        createButtonContainer.style.margin = '10px auto 0';

        // 레포트 만들기 버튼
        var createReportButton = document.createElement('button');
        createReportButton.textContent = '레포트 만들기';
        createReportButton.style.fontFamily='scd';  
        createReportButton.style.marginRight='10px';
        createReportButton.style.backgroundColor='#454997'; 
        createReportButton.style.color= 'white'; 
        createReportButton.onclick = function() { // 레포트 만들기 버튼 click 했을 떄 
            // 1. AI측으로부터 '레포트 만들기' 기능 통신(Rest-Api)
            axios({
                method: 'post',
                url: `http://localhost:8002/report`, 
                responseType: 'blob',
                data : { 
                    // 유저 아이디
                    'user_id' :  user_id,

                    // 키워드(target_object)
                    'keyword' : dropdown.options[dropdown.selectedIndex].value,
                }
            })
            .then(response => {
                // 로컬 컴퓨터에 실제 pdf 파일을 다운로드 받을 수 있도록 한다.
                data = new Blob([response.data]);
                const a =  document.createElement("a");
                a.href = window.URL.createObjectURL(data);
                a.download = 'Report.pdf';
                a.click();
                a.remove();
                
                //나가기
                alert('리포트 만들기가 완료되었습니다.');
                popup3_content.style.display = 'none'; 
            })
            .catch(error => {
                alert('오류가 발생했습니다.');
                console.log('에러');
                console.error(error); 
            });
        };
        createButtonContainer.appendChild(createReportButton);
        popup3_content.appendChild(createButtonContainer);
    })
    .catch(error => {
        alert('오류가 발생했습니다.');
        console.log('에러');
        console.error(error); 
    }); 
}

// 모달 창에서 '자주 쓰는 문구'을 click 했을 떄 호출되는 함수
function handleUseClick(){
    // 이미지
    document.querySelector(".settings-img").style.display = 'none';

    // 버튼
    crawlerBtn.classList.remove("active");
    promptBtn.classList.remove("active");
    reportBtn.classList.remove("active");
    modelSelectionBtn.classList.remove("active");
    frequentUseBtn.classList.add("active");

    document.querySelector(".content-area").style.display = "block";

    var popup1_content = document.querySelector(".popup1-content");
    popup1_content.style.display = 'none';     // '크롤러 설정' 콘텐츠는 display None

    var popup2_content = document.querySelector(".popup2-content");
    popup2_content.style.display = 'none';     // '프롬프트 설정' 콘텐츠는 display None

    var popup3_content = document.querySelector(".popup3-content");
    popup3_content.style.display = 'none';     // '리포트 설정' 콘텐츠는 display None

    var popup5_content = document.querySelector(".popup5-content");
    popup5_content.style.display = 'none';     // '모델 설정' 콘텐츠는 display None

    var popup4_content = document.querySelector(".popup4-content");
    popup4_content.innerHTML='';               // 다시 빈 내용으로 설정한다.
    popup4_content.style.display = 'block';    // 팝업 내용을 표시합니다.

    var messageBtnGroup = document.querySelector(".message-btn-group");
    messageBtnGroup.innerHTML='';              // 다시 빈 내용으로 설정한다.
    messageBtnGroup.style.display = 'flex';

    // 백엔드 측으로부터 '자주 쓰는 문구 리스트 불러오기' 기능 통신(Rest-Api)
    var frequentMessage_URL='http://localhost:8000/main/frequentMessage/';
    axios({
        method: 'get',
        url: frequentMessage_URL,
        headers: {
            'Authorization':  JSON.stringify({'Authorization': `Bearer ${token}`})
        },
    })
    .then(response => {
        console.log('자주 쓰는 문구 리스트 : ', response.data.data.message_list);

        // 화면에 자주 쓰는 문구를 보여준다.
        const messageList = response.data.data.message_list;
        renderFrequentMessages(messageList);
    })
    .catch(error => {
        alert('자주 쓰는 문구를 불러오는데 오류가 발생했습니다.');
    });
}

// 모달 창에서 '모델 설정'을 click 했을 떄 호출되는 함수 
function handleModelClick() {
    // 이미지
    document.querySelector(".settings-img").style.display = 'none';

    // 버튼
    crawlerBtn.classList.remove("active");
    promptBtn.classList.remove("active");
    reportBtn.classList.remove("active");
    modelSelectionBtn.classList.add("active");
    frequentUseBtn.classList.remove("active");

    document.querySelector(".content-area").style.display = "block";

    // AI측으로부터 자신의 모델 설정 확인 통신(Rest-Api)
    axios({
        method: 'get',
        url: `http://localhost:8002/load_template/${user_id}/chatgpt/params`, 
    })
    .then(response => {
        // 기존 팝업 내용 숨기기
        var popup1_content = document.querySelector(".popup1-content");
        popup1_content.style.display = 'none';

        var popup2_content = document.querySelector(".popup2-content");
        popup2_content.style.display = 'none';

        var popup3_content = document.querySelector(".popup3-content");
        popup3_content.style.display = 'none';

        var popup4_content = document.querySelector(".popup4-content");
        popup4_content.style.display = 'none';
        var messageBtnGroup = document.querySelector(".message-btn-group");
        messageBtnGroup.style.display = 'none';

        // 모델 설정 팝업 내용 설정
        var popup5_content = document.querySelector(".popup5-content");
        popup5_content.innerHTML = '';
        popup5_content.style.display = 'block';
        popup5_content.style.padding = '20px';

        console.log('현재 사용중인 모델 : ', response.data.model); 

        // 모델 섹션 생성
        const models = ['gpt-3.5-turbo', 'gpt-4'];
        models.forEach((modelName) => {
            // gpt-3.5-turbo와 gpt-4 텍스트와 Button을 보여주는 태그를 만든다.
            var section = document.createElement('div');
            section.style.cssText = 'display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; padding: 10px 0px 10px 10px;';

            var modelText = document.createElement('span');
            modelText.textContent = modelName;
            section.appendChild(modelText);

            // ex) 내가 'gpt-3.5-turbo'로 설정되었다면 'gpt-4'를 선택할 수 있는 Button을 마련한다.  
            if (modelName != response.data.model) {
                var modelButton = document.createElement('button');
                modelButton.textContent = '선택';
                modelButton.style.fontFamily='scd';
                modelButton.style.backgroundColor='#454997'; 
                modelButton.style.color= 'white'; 
                modelButton.onmouseover = function() {  // '선택' 버튼에 mouse를 가까이 댔을 떄 
                    this.style.backgroundColor = '#454997'; 
                    this.style.color = '#FFFFFF'; 
                };
                modelButton.onmouseout = function() {   // '선택' 버튼에 mouse를 떗을 떄 
                    this.style.backgroundColor = '#454997'; 
                    this.style.color = 'white'; 
                };
                modelButton.onclick = function() { // '선택' 버튼을 click 했을 떄 
                    // AI 측으로부터 모델 설정 기능 통신(Rest-Api)
                    axios({
                        method: 'post',
                        url: `http://localhost:8002/edit_template/${user_id}/chatgpt/params`,
                        data : {
                            'template_config' : {
                                'model' : response.data.model == 'gpt-3.5-turbo' ? 'gpt-4' : 'gpt-3.5-turbo'
                            }
                        }
                    })
                    .then(response => {       
                        alert('모델을 변경했습니다.');
                        popup5_content.style.display = 'none';  // 나가기
                    })
                    .catch(error => {
                        alert('오류가 발생했습니다.');
                        console.log('에러');
                        console.error(error); // 오류 처리
                    }); 
                }
                section.appendChild(modelButton);
            }
            popup5_content.appendChild(section);

            // 모든 섹션 뒤에 구분선 추가
            var divider = document.createElement('hr');
            popup5_content.appendChild(divider);
        });

        // 현재 사용 중인 모델 표시
        var currentModelText = document.createElement('p');
        currentModelText.textContent = `현재 사용모델: ${response.data.model}`;
        currentModelText.style.marginLeft = '8px'; 
        currentModelText.style.marginTop = '20px';
        currentModelText.style.fontSize = '14px'; 
        popup5_content.appendChild(currentModelText);

        // '나가기' 버튼을 포함하는 컨테이너
        var exitButtonContainer = document.createElement('div');
        exitButtonContainer.style.cssText = 'display: flex; justify-content: flex-end;'; 

        // '나가기' 버튼 추가
        var exitButton = document.createElement('button');
        exitButton.textContent = '나가기';
        exitButton.style.fontFamily='scd';
        exitButton.style.backgroundColor='#454997'; 
        exitButton.style.color= 'white'; 
        exitButton.onmouseover = function() {  // '나가기' 버튼 mouse를 가까이 댔을 떄 
            this.style.backgroundColor = '#454997'; 
            this.style.color = 'white'; 
        };
        exitButton.onmouseout = function() {   // '나가기' 버튼 mouse를 땠을 떄 
            this.style.backgroundColor = '#454997'; 
            this.style.color = 'white'; 
        };
        exitButton.onclick = function() {      // '나가기' 버튼을 click 했을 떄
            popup5_content.style.display = 'none'; // 나가기
        };

        // 컨테이너에 '나가기' 버튼 추가
        exitButtonContainer.appendChild(exitButton);

        // 팝업에 컨테이너 추가
        popup5_content.appendChild(exitButtonContainer);
    })
    .catch(error => {
        alert('오류가 발생했습니다.');
        console.error(error);
    });
}

// 모달 창에서 자주 쓰는 문구를 목록으로 보여주는 함수
function renderFrequentMessages(messageList){
    const container = document.querySelector('.popup4-content'); 
    const contentArea = document.querySelector(".content-area");
    container.style.height = 'calc(70vh - 171.97px)';
    container.style.overflowY = 'auto';
    container.innerHTML = ''; // 기존 내용 클리어

    // 하나씩 자주 쓰는 문구를 화면에 그린다.
    messageList.forEach(message => {   
        const div = document.createElement('div');
        div.className = 'promptTemplate';
        div.style.display = 'flex';
        div.style.alignItems = 'center';

        div.innerHTML = `
            <input type="radio" 
                name="selectedMessage"
                id="${message.template_id}"
                data-template-id="${message.template_id}"
                style="width:30px; 
                margin-right: 10px;">

            <p style="margin: 0px 10px 0px 0px; width: 35%; font-family: 'scd';">
                <label style="cursor:pointer;" for="${message.template_id}">${message.template_name}<label>
            </p>
            
 
            <textarea style="width:100%; text-align: left; font-family: 'scd'; resize: none; padding:10px;" 
                      placeholder='자주 쓰는 문구에 대한 Text를 불러와야 합니다.'
                      disabled>${message.template_content}</textarea>
            

            <button type="button"
                    style="background-color: #ccccff; color: black; padding: 5px 10px; border: none; border-radius: 5px; margin-left: 10px; width: 160px; text-align: center;  font-family: 'scd';"
                    onclick="editFrequentMessage('${message.template_id}')">수정</button>

            <button type="button" 
                    style="background-color: #ffcccc; color: black; padding: 5px 10px; border: none; border-radius: 5px; margin-left: 10px; width: 160px; text-align: center;  font-family: 'scd';"
                    onclick="deleteFrequentMessage('${message.template_id}')">삭제</button>
        `;

        container.appendChild(div);
    });

    // '추가'와 '반영' 그리고 '나가기' 버튼을 포함하는 div 추가
    var messageBtnGroup = document.querySelector(".message-btn-group");
    messageBtnGroup.style.display = 'flex';
    messageBtnGroup.style.justifyContent = 'flex-end';
    messageBtnGroup.style.width = '80%';
    messageBtnGroup.style.margin = '15px auto 0';
    messageBtnGroup.style.paddingRight = '6px';

    const addButton = document.createElement('span');
    addButton.className = 'add';
    addButton.textContent = '추가';
    addButton.style.fontFamily='scd'; 
    addButton.style.backgroundColor='#454997'; 
    addButton.style.color= 'white'; 
    addButton.onclick = function() { // '추가' 버튼을 click 했을 떄 
        addFrequentMessage();        // "추가" 버튼 click 시 호출될 함수
    };

    const reflectButton = document.createElement('span');
    reflectButton.className = 'reflect';
    reflectButton.textContent = '반영';
    reflectButton.style.fontFamily='scd'; 
    reflectButton.style.backgroundColor='#454997'; 
    reflectButton.style.color= 'white'; 
    reflectButton.onclick = function() { // '반영' 버튼을 click 했을 떄 
        reflectFrequentMessage();        // '반영' 버튼 click시 호출될 함수
    };

    const exit2Button = document.createElement('span');
    exit2Button.className = 'reflect';
    exit2Button.textContent = '나가기';
    exit2Button.style.fontFamily='scd'; 
    exit2Button.style.backgroundColor='#454997'; 
    exit2Button.style.color= 'white'; 
    exit2Button.onclick = function() {   // '나가기' 버튼을 click 했을 떄 
        contentArea.style.display = 'none'; // 나가기
    };

    messageBtnGroup.appendChild(addButton);
    messageBtnGroup.appendChild(reflectButton);
    messageBtnGroup.appendChild(exit2Button);
    contentArea.appendChild(messageBtnGroup); // 컨테이너에 추가
}

// 모달 창에서 '자주 쓰는 문구' -> '수정' 버튼이 click 될 떄 호출하는 함수
function editFrequentMessage(template_id){    
    // 수정용 팝업 표시
    document.getElementById("editFrequentMessagePopup").style.display = "flex";
    
    // 백엔드 측으로부터 '해당 문구 불러오기' 기능 통신(Rest-Api)
    axios({
        method: 'get',
        url: `http://localhost:8000/main/frequentMessage/${template_id}/`,
        headers: { 
            'Authorization':  JSON.stringify({'Authorization': `Bearer ${token}`})
        }
    })
    .then(response => {
        // 요청이 성공하면 이 부분이 실행됩니다.
        console.log('성공:', response.data); 

        // 입력을 기존 값으로 표시
        console.log("response.data.data.template_content");
        document.getElementById("editMessageTitle").value=response.data.data.template_name;
        document.getElementById("editMessageContent").value=response.data.data.template_content;

        // '수정' 버튼에 template_id 설정
        document.getElementById("editSubmitButton").dataset.templateId = template_id;
    })
    .catch(error => {
        modal.style.display = 'none';
        removeBlurFromElements();
        closeEditFrequentMessage();
        Toast.fire({
            width: '500px',
            padding: '20px',    
            icon: 'error',
            title: '오류가 발생했습니다. 다시 시도해주세요.',
        });
    });
}

// 자주 쓰는 문구를 수정하는 팝업에서 '수정'를 click했을 떄 호출되는 함수
function submitEditFrequentMessage(){
    var templateId = document.getElementById("editSubmitButton").dataset.templateId;
    var editMessageTitle = document.getElementById("editMessageTitle").value;
    var editMessageContent = document.getElementById("editMessageContent").value;

    // 백엔드 측으로부터 '자주 쓰는 문구 수정' 기능과 통신(Rest-Api)
    const editFrequentMessage_URL='http://localhost:8000/main/frequentMessage/update/'; 
    axios({
        method: 'post',
        url: editFrequentMessage_URL,
        headers: {
            'Authorization':  JSON.stringify({'Authorization': `Bearer ${token}`})
        },
        data:  {'template_id': templateId, 
                'template_name': editMessageTitle, 
                'template_content': editMessageContent},
    })
    .then(response => {
        // '수정하는 자주 쓰는 문구' 팝업을 종료한다.
        document.getElementById("editFrequentMessagePopup").style.display = "none";

        // AI 설정 팝업을 다시 불러온다
        handleUseClick();
    })
    .catch(error => {
        console.log('에러');
        console.log(error);
    });
}

// 자주 쓰는 문구를 수정하는 팝업에서 '취소'를 click 했을 떄 호출되는 함수
function closeEditFrequentMessage(){
    // 수정용 팝업의 'display' 속성을 'none'으로 설정
    document.getElementById("editFrequentMessagePopup").style.display = "none";
}

// 모달 창에서 '자주 쓰는 문구' -> '삭제' 버튼이 click 될 떄 호출하는 함수
function deleteFrequentMessage(template_id){
    // 정말 삭제할건지 묻기
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
            // 백엔드 측으로부터 '자주 쓰는 문구 삭제' 기능과 통신(Rest-APi)
            const deleteFrequentMessage_URL='http://localhost:8000/main/frequentMessage/delete/';
            axios({
                method: 'post',
                url: deleteFrequentMessage_URL,
                headers: {
                    'Authorization':  JSON.stringify({'Authorization': `Bearer ${token}`})
                },
                data:{'template_id': template_id},
            })
            .then(response => {
                // AI 설정 팝업을 다시 불러온다
                handleUseClick();
            })
            .catch(error => {
                console.log('에러');
                console.log(error);
            });
        }
    });
}

// 모달 창에서 '자주 쓰는 문구' -> '추가' 버튼이 click 될 떄 호출되는 함수
function addFrequentMessage() {
    // 추가용 팝업 표시
    document.getElementById("addFrequentMessagePopup").style.display = "flex";

    // 입력을 빈칸으로 표시
    document.getElementById("messageTitle").value='';
    document.getElementById("messageContent").value='';
}

// 자주 쓰는 문구를 추가하는 팝업에서 '추가'를 click했을 떄 호출되는 함수
function submitFrequentMessage() {
    // 문구 제목과 내용의 값을 가져옵니다.
    var title = document.getElementById("messageTitle").value;
    var content = document.getElementById("messageContent").value;

    // 백엔드 측으로부터 '자주 쓰는 문구 생성' 기능과 통신(Rest-Api)
    var addFrequentMessage_URL='http://localhost:8000/main/frequentMessage/create/';
    axios({
        method: 'post',
        url: addFrequentMessage_URL,
        headers: {
            'Authorization':  JSON.stringify({'Authorization': `Bearer ${token}`})
        },
        data: {'template_name': title,
               'template_content': content,
              },
    })
    .then(response => {
        console.log('성공');

        // '자주 쓰는 문구 생성' 팝업을 종료한다.
        document.getElementById("addFrequentMessagePopup").style.display = "none";

        // AI 설정 팝업을 다시 불러온다
        handleUseClick();
    })
    .catch(error => {
        console.log('에러');
        console.log(error);
    });
}

// 자주 쓰는 문구를 추가하는 팝업에서 '취소'를 click 했을 떄 호출되는 함수
function closeFrequentMessage() {
    document.getElementById("addFrequentMessagePopup").style.display = "none";
}

// 모달 창에서 '자주 쓰는 문구' -> '반영' 버튼을 click 했을 떄 호출되는 함수
function reflectFrequentMessage(){
    const selectedCheckbox = document.querySelector('.promptTemplate input[type="radio"]:checked'); 

    // 체크박스를 적용했는지 안했는지 여부를 판단한다.
    if (selectedCheckbox) {
        const templateValue = selectedCheckbox.nextElementSibling.nextElementSibling.value; // 체크박스의 다음 다음 요소인 input 태그의 value를 가져옵니다.

        // AI 설정 팝업을 닫는다.
        const modal = document.getElementById('myModal');
        modal.style.display = 'none';

        // 블러를 제거한다.
        removeBlurFromElements();

        // 하단 입력창이 열려있는지 안열려있는지 확인
        checkMessageFormDisplay(templateValue);
    } 
    else {
        alert('선택된 메시지가 없습니다.');
    }
}

// 하단 입력창이 열려 있는지 확인하는 함수
function checkMessageFormDisplay(templateValue){
    const messageForm = document.getElementById('message-form');
    const style = window.getComputedStyle(messageForm);

    if (style.display==='block') {
        // 하단 입력창에 text 붙이기
        var textareaElement = document.getElementById('message');
        textareaElement.value=templateValue.trim();
    }  
    else {
        Toast.fire({
            width: '500px',
            padding: '20px',    
            icon: 'error',
            title: '하단에 입력창이 활성화 되어야 적용할 수 있습니다.'
        });
    }
}

// '문의 게시판'를 클릭하면 Routing 하는 함수
function goInquiry(){
    window.location.href='../inquiryBoard.html';
}

// 바깥쪽 클릭시 모달창 닫기
const modal = document.getElementById('myModal');
// 모달 바깥 영역 클릭 시 모달 닫기
window.addEventListener('click', function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
        removeBlurFromElements();
    }
});

// toTop 함수
function toTop() {
    document.querySelector(".conversation-view").scrollTo(0,0);
}

// toBottom 함수
function toBottom() {
    var converView = document.querySelector(".conversation-view")
    console.log(converView.body)
    converView.scrollTo(0,converView.scrollHeight);
}