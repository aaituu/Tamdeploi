// Массив загадок
const puzzles = [
    {
        hint1: "ҚАРА (чёрный) 👤",
        hint2: "ҚАЛПАҚ (кепка) 🧢",
        answer: "ҚАРАҚАЛПАҚСТАН"
    },
    {
        hint1: "БАЛ (мёд) 🍯",
        hint2: "ҚАШУ (бегун) 🏃",
        answer: "БАЛҚАШ"
    },
    {
        hint1: "АТА (дед) 👴",
        hint2: "СУ (вода) 💧",
        answer: "АТАСУ"
    },
    {
        hint1: "ЕКІ (два) ✌️",
        hint2: "БАС (голова) 🗣️",
        answer: "ЕКІБАСТҰЗ"
    },
    {
        hint1: "ҚАЗАН (казан) 🍲",
        hint2: "",
        answer: "ҚАЗАН"
    },
    {
        hint1: "ПЁТР 👨",
        hint2: "ПАВЕЛ 👨",
        answer: "ПЕТРОПАВЛ"
    },
    {
        hint1: "ШАЙТАН 👿",
        hint2: "КӨЛ (озеро) 🌊",
        answer: "ШАЙТАНКӨЛ"
    }
];

let currentIndex = 0;
let answerShown = false;

// Инициализация при загрузке страницы
window.onload = function() {
    document.getElementById('totalPuzzles').textContent = puzzles.length;
    loadPuzzle(currentIndex);
};

// Загрузка загадки
function loadPuzzle(index) {
    const puzzle = puzzles[index];
    
    document.getElementById('hint1').textContent = puzzle.hint1;
    document.getElementById('hint2').textContent = puzzle.hint2;
    document.getElementById('answerText').textContent = puzzle.answer;
    document.getElementById('currentPuzzle').textContent = index + 1;
    
    // Скрыть ответ
    document.getElementById('answerBox').classList.add('hidden');
    document.getElementById('showAnswerBtn').textContent = 'Показать ответ';
    answerShown = false;
    
    // Управление кнопками
    document.getElementById('prevBtn').disabled = (index === 0);
    document.getElementById('nextBtn').disabled = (index === puzzles.length - 1);
    
    // Добавить анимацию
    document.querySelector('.game-content').classList.remove('fade-in');
    setTimeout(() => {
        document.querySelector('.game-content').classList.add('fade-in');
    }, 10);
}

// Показать/скрыть ответ
function toggleAnswer() {
    const answerBox = document.getElementById('answerBox');
    const btn = document.getElementById('showAnswerBtn');
    
    if (answerShown) {
        answerBox.classList.add('hidden');
        btn.textContent = 'Показать ответ';
        answerShown = false;
    } else {
        answerBox.classList.remove('hidden');
        btn.textContent = 'Скрыть ответ';
        answerShown = true;
    }
}

// Следующая загадка
function nextPuzzle() {
    if (currentIndex < puzzles.length - 1) {
        currentIndex++;
        loadPuzzle(currentIndex);
    }
}

// Предыдущая загадка
function previousPuzzle() {
    if (currentIndex > 0) {
        currentIndex--;
        loadPuzzle(currentIndex);
    }
}