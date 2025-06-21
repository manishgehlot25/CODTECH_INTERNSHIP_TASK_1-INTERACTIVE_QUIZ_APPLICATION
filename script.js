const questions = [
    {
        category: "HTML",
        question: "What does HTML stand for?",
        options: ["Hyperlinks and Text Markup Language", "Home Tool Markup Language", "Hyper Text Markup Language", "Hyper Tool Multi Language"],
        answer: 2
    },
    {
        category: "CSS",
        question: "Which language is used for styling web pages?",
        options: ["HTML", "JQuery", "CSS", "XML"],
        answer: 2
    },
    {
        category: "JavaScript",
        question: "Which is not a JavaScript Framework?",
        options: ["Python Script", "JQuery", "Django", "NodeJS"],
        answer: 2
    },
    {
        category: "PHP",
        question: "Which is used for Connect To Database?",
        options: ["PHP", "HTML", "JS", "All"],
        answer: 0
    },
    {
        category: "CSS",
        question: "What does CSS stand for?",
        options: ["Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets", "Computer Style Sheets"],
        answer: 1
    }
];

let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 10;
let selectedOptionIndex = null;

const quizContainer = document.getElementById('quiz-container');
const questionEl = document.getElementById('question');
const optionsList = document.getElementById('option-list');
const scoreEl = document.getElementById('score');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const skipBtn = document.getElementById('skip-btn');
const restartBtn = document.getElementById('restart-btn');
const timerEl = document.getElementById('timer');
const categoryEl = document.getElementById('category');

function startQuiz() {
    document.getElementById('start-screen').style.display = 'none';
    quizContainer.style.display = 'block';
    loadQuestion();
}

function startTimer() {
    timeLeft = 10;
    timerEl.textContent = `Time Left: ${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `Time Left: ${timeLeft}s`;
        if (timeLeft === 0) {
            clearInterval(timer);
            selectAnswer(null);
            setTimeout(() => {
                if (currentQuestion < questions.length - 1) {
                    currentQuestion++;
                    loadQuestion();
                } else {
                    showFinalScore();
                }
            }, 1000);
        }
    }, 1000);
}

function loadQuestion() {
    resetState();
    selectedOptionIndex = null;
    const q = questions[currentQuestion];
    questionEl.textContent = `${currentQuestion + 1}. ${q.question}`;
    categoryEl.textContent = `Category: ${q.category}`;

    q.options.forEach((option, index) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.onclick = () => {
            document.querySelectorAll('.options button').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedOptionIndex = index;
        };
        li.appendChild(btn);
        optionsList.appendChild(li);
    });

    startTimer();
}

function resetState() {
    optionsList.innerHTML = '';
    clearInterval(timer);
}

function selectAnswer(selectedIndex) {
    const q = questions[currentQuestion];
    const allButtons = document.querySelectorAll('.options button');

    allButtons.forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.answer) {
            btn.classList.add('correct');
        } else if (i === selectedIndex) {
            btn.classList.add('wrong');
        }
    });

    if (selectedIndex === q.answer) {
        score++;
        scoreEl.textContent = `Score: ${score}`;
    }

    navigator.vibrate?.(200);
}

nextBtn.addEventListener('click', () => {
    if (selectedOptionIndex !== null) {
        selectAnswer(selectedOptionIndex);
    }
    setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            loadQuestion();
        } else {
            showFinalScore();
        }
    }, 500);
});

prevBtn.addEventListener('click', () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
});

skipBtn.addEventListener('click', () => {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        showFinalScore();
    }
});

restartBtn.addEventListener('click', () => {
    currentQuestion = 0;
    score = 0;
    scoreEl.textContent = 'Score: 0';
    restartBtn.style.display = 'none';
    nextBtn.style.display = 'inline-block';
    prevBtn.style.display = 'inline-block';
    skipBtn.style.display = 'inline-block';
    loadQuestion();
});

function showFinalScore() {
    clearInterval(timer);
    questionEl.textContent = `Quiz Completed!`;
    optionsList.innerHTML = `<li><strong>Your Score: ${score}/${questions.length}</strong></li>`;
    timerEl.textContent = '';
    nextBtn.style.display = 'none';
    prevBtn.style.display = 'none';
    skipBtn.style.display = 'none';
    restartBtn.style.display = 'inline-block';
}

window.addEventListener('beforeunload', () => {
    localStorage.setItem('quiz-score', score);
});