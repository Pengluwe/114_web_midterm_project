
// 1. 遊戲數據結構 (分級與本地圖片)
const originalQuizData = {
    basic: [
        {
            type: "multiple-choice", // 選擇題
            image: "./assets/54437490002_74ecffef9e_b.jpg",
            question: "【基礎題】請猜這是哪種四引擎巨型客機?",
            options: ["Airbus A350", "Boeing 747", "Airbus A330", "Boeing 787"],
            answer: "Boeing 747",
            hint: "它有獨特的『駝峰』和四個發動機,曾是『天空女王』。",
        },
        {
            type: "multiple-choice",
            image: "./assets/dcoZPWrcSDHQkhFrxuCNFfKAUscxjoxAYtEFtZYsAXYwkKYfzksLryDEYUGNtqqO.jpg",
            question: "【基礎題】這是一款歐洲製造的窄體客機,常飛短程航線?",
            options: ["Airbus A320", "Boeing 737", "Bombardier CRJ", "Embraer E195"],
            answer: "Airbus A320",
            hint: "它是短程航線的主力機種,機鼻上方窗戶邊角有斜切設計。",
        },
        {
            type: "multiple-choice",
            image: "./assets/Boeing_787_N1015B_ANA_Airlines_(27611880663)_(cropped).jpg",
            question: "【基礎題】這架客機以其超大且鋸齒狀的發動機短艙聞名,被稱為『夢幻客機』,它是?",
            options: ["Boeing 737 MAX", "Airbus A321", "Boeing 787", "Airbus A380"],
            answer: "Boeing 787",
            hint: "機翼上翹明顯,大量使用複合材料。",
        }
    ],
    advanced: [
        {
            type: "text-input", // 問答題
            image: "./assets/stuttgart-germany-february-28-2018-600nw-1774202057.webp", 
            question: "【進階題】這款窄體客機曾是歷史上生產數量最多的噴射客機,它是?",
            answer: "Boeing 737",
            acceptableAnswers: ["Boeing 737", "737", "B737", "波音737"], // 可接受的答案
            hint: "它被暱稱為『鼻屎機』,從 60 年代一直生產至今。",
        },
        {
            type: "text-input",
            image: "./assets/Lockheed_Martin_F-22A_Raptor_JSOH.jpg", 
            question: "【進階題】這款美國第五代隱形戰鬥機的名稱是?",
            answer: "F-22 Raptor",
            acceptableAnswers: ["F-22 Raptor", "F-22", "F22", "Raptor", "猛禽"],
            hint: "它是世界第一種進入服役的第五代戰鬥機。",
        },
        {
            type: "text-input",
            image: "./assets/N313FE_Fedex_1988_McDonnell_Douglas_DC-10-30(F)_CN-_48311-440__Bilal__(13929394625).jpg",
            question: "【進階題】這款廣體客機以其機尾垂直尾翼上的第三個發動機聞名,它是?",
            answer: "McDonnell Douglas DC-10",
            acceptableAnswers: ["McDonnell Douglas DC-10", "DC-10", "DC10", "MD DC-10"],
            hint: "它是一款廣體三引擎客機,與 L-1011 為主要競爭對手。",
        }
    ]
};



// 2. 全局狀態與 DOM 元素
let currentQuestionIndex = 0;
let score = 0;
let hasAnswered = false;
let shuffledQuizData = []; 

// DOM 元素變數
let introScreen, startButton, quizCard, scoreDisplay, 
    totalQuestionsDisplay, questionNumberDisplay, aircraftImage, 
    questionText, optionsContainer, nextButton, hintButton, 
    hintArea, hintText, resultArea, finalScoreDisplay, restartButton;


// 3. 隨機題目抽選函數:陣列洗牌 (Fisher-Yates)
function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}


// 4. 遊戲流程控制函數
function initializeGame() {
    // DOM 抓取
    introScreen = document.querySelector('#intro-screen');
    startButton = document.querySelector('#start-btn');
    quizCard = document.querySelector('#quiz-card');
    scoreDisplay = document.querySelector('#score-display');
    totalQuestionsDisplay = document.querySelector('#total-questions');
    questionNumberDisplay = document.querySelector('#question-number');
    aircraftImage = document.querySelector('#aircraft-image');
    questionText = document.querySelector('#question-text');
    optionsContainer = document.querySelector('#options-container');
    nextButton = document.querySelector('#next-btn');
    hintButton = document.querySelector('#hint-btn');
    hintArea = document.querySelector('#hint-area');
    hintText = document.querySelector('#hint-text');
    resultArea = document.querySelector('#result-area');
    finalScoreDisplay = document.querySelector('#final-score');
    restartButton = document.querySelector('#restart-btn');
    
    // 重設與洗牌
    currentQuestionIndex = 0;
    score = 0;
    scoreDisplay.textContent = score;
    
    const basicShuffled = shuffleArray([...originalQuizData.basic]);
    const advancedShuffled = shuffleArray([...originalQuizData.advanced]);
    
    shuffledQuizData = [...basicShuffled, ...advancedShuffled]; 
    totalQuestionsDisplay.textContent = shuffledQuizData.length;
    
    // 流程控制
    introScreen.classList.remove('d-none');
    quizCard.classList.add('d-none');
    resultArea.classList.add('d-none');
    
    setupEventListeners(); 
}

function setupEventListeners() {
    if (startButton && !startButton.hasAttribute('data-listeners-bound')) {
        startButton.addEventListener('click', startGame);
        nextButton.addEventListener('click', handleNextClick);
        hintButton.addEventListener('click', handleHintClick);
        restartButton.addEventListener('click', initializeGame);
        
        startButton.setAttribute('data-listeners-bound', 'true'); 
    }
}

function startGame() {
    introScreen.classList.add('d-none');
    quizCard.classList.remove('d-none');
    loadQuestion(currentQuestionIndex);
}

function handleNextClick() {
    currentQuestionIndex++;
    loadQuestion(currentQuestionIndex);
}

function handleHintClick() {
    hintArea.classList.remove('d-none');
    hintButton.disabled = true; 
}


// 5. 載入問題 (支援選擇題與問答題)
function loadQuestion(index) {
    if (index >= shuffledQuizData.length) {
        showResults();
        return;
    }
    
    hasAnswered = false;
    nextButton.disabled = true;
    hintArea.classList.add('d-none');
    hintButton.disabled = false;
    
    const currentQuiz = shuffledQuizData[index]; 
    
    // 更新問題資訊
    questionNumberDisplay.textContent = `第 ${index + 1} 題`;
    aircraftImage.src = currentQuiz.image;
    questionText.textContent = currentQuiz.question;
    hintText.textContent = currentQuiz.hint;

    // 根據題目類型渲染不同的介面
    if (currentQuiz.type === "multiple-choice") {
        renderMultipleChoice(currentQuiz.options);
    } else if (currentQuiz.type === "text-input") {
        renderTextInput();
    }
}


// 6. 渲染選擇題選項
function renderMultipleChoice(options) {
    optionsContainer.innerHTML = ''; 
    
    options.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-outline-secondary', 'btn-lg', 'text-start');
        button.textContent = option;
        button.value = option;
        
        button.addEventListener('click', handleAnswerClick); 
        
        optionsContainer.appendChild(button);
    });
}


// 7. 渲染問答題輸入框
function renderTextInput() {
    optionsContainer.innerHTML = ''; 
    
    // 創建輸入框容器
    const inputGroup = document.createElement('div');
    inputGroup.classList.add('input-group', 'input-group-lg', 'mb-3');
    
    // 創建輸入框
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'answer-input';
    input.classList.add('form-control', 'form-control-lg');
    input.placeholder = '請輸入飛機型號...';
    input.setAttribute('autocomplete', 'off');
    
    // 創建提交按鈕
    const submitBtn = document.createElement('button');
    submitBtn.classList.add('btn', 'btn-primary');
    submitBtn.textContent = '提交答案';
    submitBtn.type = 'button';
    
    // 綁定提交事件
    submitBtn.addEventListener('click', handleTextInputSubmit);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleTextInputSubmit();
        }
    });
    inputGroup.appendChild(input);
    inputGroup.appendChild(submitBtn);
    optionsContainer.appendChild(inputGroup);
    // 自動聚焦
    setTimeout(() => input.focus(), 100);
}



// 8. 處理選擇題答案
function handleAnswerClick(event) {
    if (hasAnswered) return;
    hasAnswered = true; 
    
    const selectedButton = event.target;
    const selectedAnswer = selectedButton.value;
    const currentQuiz = shuffledQuizData[currentQuestionIndex];
    
    if (selectedAnswer === currentQuiz.answer) {
        score++;
        scoreDisplay.textContent = score;
        
        selectedButton.classList.remove('btn-outline-secondary');
        selectedButton.classList.add('btn-success');
    } else {
        selectedButton.classList.remove('btn-outline-secondary');
        selectedButton.classList.add('btn-danger');
        
        // 標記正確答案
        document.querySelectorAll('#options-container button').forEach(button => {
            if (button.value === currentQuiz.answer) {
                button.classList.remove('btn-outline-secondary');
                button.classList.add('btn-success');
            }
        });
    }

    disableOptions();
    nextButton.disabled = false;
    hintButton.disabled = true;
}


// 9. 處理問答題答案
function handleTextInputSubmit() {
    if (hasAnswered) return;
    
    const input = document.querySelector('#answer-input');
    const submitBtn = input.nextElementSibling;
    const userAnswer = input.value.trim();
    
    if (userAnswer === '') {
        input.classList.add('is-invalid');
        setTimeout(() => input.classList.remove('is-invalid'), 500);
        return;
    }
    
    hasAnswered = true;
    const currentQuiz = shuffledQuizData[currentQuestionIndex];
    
    // 檢查答案是否正確 (不區分大小寫)
    const isCorrect = currentQuiz.acceptableAnswers.some(
        acceptable => acceptable.toLowerCase() === userAnswer.toLowerCase()
    );
    
    // 結果顯示區域
    const feedbackDiv = document.createElement('div');
    feedbackDiv.classList.add('alert', 'mt-3');
    
    if (isCorrect) {
        score++;
        scoreDisplay.textContent = score;
        
        feedbackDiv.classList.add('alert-success');
        feedbackDiv.innerHTML = `
            <strong>✓ 答對了!</strong><br>
            正確答案是: <span class="fw-bold">${currentQuiz.answer}</span>
        `;
        input.classList.add('is-valid');
    } else {
        feedbackDiv.classList.add('alert-danger');
        feedbackDiv.innerHTML = `
            <strong>✗ 答錯了!</strong><br>
            您的答案: <span class="text-decoration-line-through">${userAnswer}</span><br>
            正確答案是: <span class="fw-bold">${currentQuiz.answer}</span>
        `;
        input.classList.add('is-invalid');
    }
    
    input.disabled = true;
    submitBtn.disabled = true;
    optionsContainer.appendChild(feedbackDiv); 
    nextButton.disabled = false;
    hintButton.disabled = true;
}


// 10. 禁用選項
function disableOptions() {
    document.querySelectorAll('#options-container button').forEach(button => {
        button.disabled = true;
    });
}


// 11. 遊戲結束
function showResults() {
    quizCard.classList.add('d-none');
    resultArea.classList.remove('d-none');
    finalScoreDisplay.textContent = score;
}


// 12. 啟動遊戲
document.addEventListener('DOMContentLoaded', initializeGame);