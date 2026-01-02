// Задания для игры
const tasks = [
    {
        icon: "🧔",
        text: "Принесите лысого человека из зала"
    },
    {
        icon: "👶",
        text: "Принесите человека, прошедшего сундет (обрезание)"
    },
    {
        icon: "🪨",
        text: "Принесите камень"
    },
    {
        icon: "😙",
        text: "Принесите женщину, которая умеет свистеть"
    },
    {
        icon: "👞",
        text: "Принесите туфли друга жениха"
    },
    {
        icon: "💍",
        text: "Принесите человека с золотым кольцом"
    },
    {
        icon: "👓",
        text: "Принесите человека в очках"
    },
    {
        icon: "📱",
        text: "Принесите телефон самой новой модели"
    },
    {
        icon: "🎀",
        text: "Принесите что-то красного цвета"
    },
    {
        icon: "🔑",
        text: "Принесите связку ключей с 5 и более ключами"
    }
];

let currentTaskIndex = 0;
let currentRound = 1;
let playersCount = 6;
let chairsCount = 5;
let gameStarted = false;
let timerInterval = null;
let timeLeft = 60;

// Начать игру
function startGame() {
    gameStarted = true;
    currentTaskIndex = 0;
    currentRound = 1;
    playersCount = 6;
    chairsCount = 5;
    
    // Обновить UI
    updateGameStatus();
    document.getElementById('startGameBtn').classList.add('hidden');
    document.getElementById('nextTaskBtn').classList.remove('hidden');
    document.getElementById('eliminatePlayerBtn').classList.remove('hidden');
    document.getElementById('startTimerBtn').disabled = false;
    
    // Показать первое задание
    showTask(currentTaskIndex);
}

// Показать задание
function showTask(index) {
    if (index >= tasks.length) {
        alert('Все задания выполнены! Игра окончена.');
        endGame();
        return;
    }
    
    const task = tasks[index];
    
    // Скрыть плейсхолдер
    const placeholder = document.querySelector('.task-placeholder');
    if (placeholder && placeholder.parentElement) {
        placeholder.parentElement.style.display = 'none';
    }
    
    // Показать задание
    document.getElementById('taskNumber').textContent = index + 1;
    document.getElementById('taskIcon').textContent = task.icon;
    document.getElementById('taskText').textContent = task.text;
    document.getElementById('taskBox').classList.remove('hidden');
    
    // Перезапустить анимацию
    const taskBox = document.getElementById('taskBox');
    taskBox.style.animation = 'none';
    setTimeout(() => {
        taskBox.style.animation = '';
    }, 10);
    
    // Сбросить таймер
    resetTimer();
}

// Обновить статус игры
function updateGameStatus() {
    document.getElementById('currentRound').textContent = currentRound;
    document.getElementById('playersCount').textContent = playersCount;
    document.getElementById('chairsCount').textContent = chairsCount;
}

// Следующее задание
function nextTask() {
    if (playersCount <= 1) {
        alert(`Игра окончена! Победитель определён!`);
        endGame();
        return;
    }
    
    currentTaskIndex++;
    currentRound++;
    showTask(currentTaskIndex);
}

// Игрок выбыл
function eliminatePlayer() {
    if (playersCount <= 1) {
        alert('Остался только один игрок - победитель!');
        endGame();
        return;
    }
    
    playersCount--;
    chairsCount = playersCount - 1;
    
    updateGameStatus();
    
    if (playersCount === 1) {
        alert('Поздравляем победителя!');
        endGame();
    }
}

// Запустить таймер
function startTimer() {
    if (timerInterval) {
        return;
    }
    
    document.getElementById('startTimerBtn').disabled = true;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timerValue').textContent = timeLeft;
        
        // Предупреждение при малом времени
        if (timeLeft <= 10) {
            document.getElementById('timerValue').classList.add('warning');
        }
        
        // Время истекло
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            playSound();
            alert('Время истекло!');
            document.getElementById('startTimerBtn').disabled = false;
        }
    }, 1000);
}

// Сбросить таймер
function resetTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    timeLeft = 60;
    document.getElementById('timerValue').textContent = timeLeft;
    document.getElementById('timerValue').classList.remove('warning');
    document.getElementById('startTimerBtn').disabled = false;
}

// Завершить игру
function endGame() {
    gameStarted = false;
    
    if (confirm('Хотите начать новую игру?')) {
        location.reload();
    }
}

// Звуковой сигнал (можно заменить на реальный звук)
function playSound() {
    // Простая имитация звука через визуальную анимацию
    const timerValue = document.getElementById('timerValue');
    let flashCount = 0;
    const flashInterval = setInterval(() => {
        timerValue.style.backgroundColor = flashCount % 2 === 0 ? '#e74c3c' : 'white';
        flashCount++;
        if (flashCount >= 6) {
            clearInterval(flashInterval);
            timerValue.style.backgroundColor = 'white';
        }
    }, 200);
}