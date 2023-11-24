const eggContainer = document.getElementById('eggContainer');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');
const startMessage = document.getElementById('startMessage');
const timerDisplay = document.getElementById('timer');
const endModal = document.getElementById('endModal');
const finalScore = document.getElementById('finalScore');
const realEndGameButton = document.getElementById('realEndGame')
const eggTypes = [{color: 'yellow', points: 1, probability: 80}, {color: 'gold', points: 10, probability: 10}, {color: 'black', points: -5, probability: 10}];

let score = 0;
let gameTimer;
let timerSeconds = 60;
let timerInterval;

function startGame() {
    startButton.disabled = true;
    score = 0;
    scoreDisplay.innerText = '점수: ' + score;
    gameTimer = setTimeout(endGame, 60000); // 1분 타이머
    spawnEgg();
}

function spawnEgg() {
    for (let i = 0; i < 3; i++) { // 한 번에 세 개의 계란 생성
        const eggType = getRandomEggType();
        const egg = document.createElement('div');
        const basket = document.getElementById('basket');

        egg.classList.add('egg');
        egg.style.backgroundColor = eggType.color;
        egg.style.bottom = '-400px'; // 바구니 높이
        egg.style.left = `calc(50% - 25px)`; // 바구니 중앙에 위치
        egg.style.animationDuration = `${Math.random() * 1.5 + 1.5}s`; // 1.5초에서 3초 사이의 랜덤한 애니메이션 시간
        egg.style.setProperty('--popX', `${(Math.random() * 600) - 300}px`); // -300px에서 300px 사이의 랜덤한 수평 이동

        egg.addEventListener('animationend', () => {
            egg.remove(); // 애니메이션이 끝나면 계란 제거
        });

        egg.onclick = function(event) {
            score += eggType.points;
            scoreDisplay.innerText = '점수: ' + score;

            // "Hit!" 메시지 표시
            showHitMessage(event.clientX, event.clientY);

            eggContainer.removeChild(egg);
        };

        eggContainer.appendChild(egg);
    }

    if (gameTimer) {
        setTimeout(spawnEgg, Math.random() * 2000); // 계란 생성 간격 조절
    }
}

function showHitMessage(x, y) {
    const hitMessage = document.createElement('div');
    hitMessage.textContent = 'Hit!';
    hitMessage.className = 'hit-message';
    hitMessage.style.left = x + 'px';
    hitMessage.style.top = y + 'px';
    document.body.appendChild(hitMessage);

    setTimeout(() => {
        hitMessage.remove();
    }, 500); // "Hit!" 메시지는 0.5초 후에 사라짐
}


function getRandomEggType() {
    let random = Math.random() * 100;
    for (const eggType of eggTypes) {
        if ((random -= eggType.probability) < 0) {
            return eggType;
        }
    }
}

// 랭킹 업데이트 및 저장
function updateRanking(newScore, nickname) {
    const ranking = getRanking();
    const newRanking = {
        score: newScore,
        nickname: nickname
    }
    ranking.push(newRanking);
  
    saveRanking(newRanking);
    displayRanking();
}

// 로컬 스토리지에서 랭킹 가져오기
function getRanking() {
    return JSON.parse(localStorage.getItem('ranking')) || [];
}

// 로컬 스토리지에 랭킹 저장
function saveRanking(ranking) {
    const list = getRanking()
    localStorage.setItem('ranking', JSON.stringify(list.concat(ranking)));
}

// 랭킹 표시
function displayRanking() {
    const rankingList = document.getElementById('rankingList');
    rankingList.innerHTML = '';

    const savedData = getRanking().sort((a, b) => b.score - a.score).slice(0, 10);
    

    savedData.forEach((data) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${data.nickname ?? "Unknown"} : ${data.score}점`;
        rankingList.appendChild(listItem);
    });
}

function endGame() {
    clearTimeout(gameTimer);
    gameTimer = null;
    finalScore.innerText = score;
    endModal.style.display = 'block';
    startButton.disabled = false;
    eggContainer.innerHTML = ''; // 계란 삭제

   
}

function realEndGame(){
    const nickname = window.prompt("닉네임을 입력해주세요")

    updateRanking(score, nickname);
    endModal.style.display = 'none';
}

// 타이머 시작 함수
function startTimer() {
    timerInterval = setInterval(() => {
        // 초를 분:초 형식으로 표시
        const minutes = Math.floor(timerSeconds / 60);
        const seconds = timerSeconds % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        // 1초씩 감소
        timerSeconds--;

        // 타이머가 0초 이하로 내려가면 게임 종료
        if (timerSeconds < 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = '0:00';
            endGame();
        }
    }, 1000); // 1초마다 업데이트
}


// 게임 종료 모달 닫기
endModal.onclick = function(event) {
    if (event.target == endModal) {
        endModal.style.display = 'none';
    }
};



// 시작 버튼 클릭 이벤트 핸들러 추가
startButton.addEventListener('click', () => {
    // 시작 메시지 숨기기
    startMessage.style.display = 'none';
    // 타이머 시작
    startTimer();
    // 게임 시작 함수 호출
    startGame();
});

realEndGameButton.onclick = function(){
    realEndGame()
}

displayRanking()