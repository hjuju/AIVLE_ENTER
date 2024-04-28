// localStorage에 토큰 적재하기
const setWithExpire = (key, value, exp) => {
    let now = new Date(); // 현재 날짜와 시간
    const item = {[`${key}`]: value, expires: now.getTime() + exp}

    // item의 형태로 로컬에 저장
    localStorage.setItem(key, JSON.stringify(item));
}

// localStorage에서 토큰 가져오기
const getWithExpire = (key) => {
    // 토큰 불러오기
    const itemStr = localStorage.getItem(key);
    if(!itemStr) {
        return null;
    }
    const item = JSON.parse(itemStr);

    // 현재 시간이 만료시간보다 넘어가면 로컬스토리지에 저장된 토큰 삭제
    const now = new Date();
    if (now.getTime() > item.expires) {
        localStorage.removeItem(key);
        return null
    }

    // 시간이 넘지 않았다면 해당 value를 반환
    return item[key];
}

// 알림창 선언
const Toast = Swal.mixin({
    toast: true,
    position: 'center',
    showConfirmButton: false,
    timer: 900,
    timerProgressBar: false,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

// '로그아웃'을 클릭하면 Routing 하는 함수
function goLogout(){
    Swal.fire({
        text: "로그아웃 하시겠습니까?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#454997',
        confirmButtonText: '예',
        cancelButtonText: '아니오'
    }).then((result) => {
        if (result.isConfirmed) {
            // 실제 동작 수행
            localStorage.removeItem('accessToken'); // localStroage에서 'accessToken' 삭제    
            window.location.reload();               // 현재 페이지를 새로고침
        }
    });   
}

// '로그인'을 클릭하면 Routing 하는 함수
function goLogin(){
    Swal.fire({
        text: "로그인 하시겠습니까?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#454997',
        confirmButtonText: '예',
        cancelButtonText: '아니오'
    }).then((result) => {
        if (result.isConfirmed) {
            // 실제 동작 수행
            window.location.href = '../signin.html';
        }
    });   
}
