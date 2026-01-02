// Массив заданий для фото
const tasks = [
    "Сделайте селфи всей командой с официантом",
    "Сфотографируйте самое красивое блюдо на вашем столе",
    "Сделайте фото команды в виде пирамиды",
    "Сфотографируйте что-то красного цвета в зале",
    "Сделайте групповое фото с смешными гримасами",
    "Сфотографируйте самый необычный предмет в зале",
    "Сделайте фото команды, где все прыгают",
    "Сфотографируйте декор зала крупным планом",
    "Сделайте креативное фото с использованием света",
    "Сфотографируйте команду, изображающую известную картину",
    "Сделайте фото всей команды в отражении",
    "Сфотографируйте что-то круглое в зале"
];

let usedTasks = [];
let availableTasks = [...tasks];
let currentTaskIndex = 0;

// Инициализация
window.onload = function() {
    document.getElementById('totalTasks').textContent = tasks.length;
    updateTaskCounter();
};

// Получить новое задание
function getNewTask() {
    // Если все задания использованы
    if (availableTasks.length === 0) {
        alert('Все задания выполнены! Нажмите "Начать сначала" для новой игры.');
        return;
    }
    
    // Выбрать случайное задание из доступных
    const randomIndex = Math.floor(Math.random() * availableTasks.length);
    const selectedTask = availableTasks[randomIndex];
    
    // Удалить задание из доступных
    availableTasks.splice(randomIndex, 1);
    usedTasks.push(selectedTask);
    
    // Показать задание
    displayTask(selectedTask);
    
    // Обновить счетчик
    currentTaskIndex++;
    updateTaskCounter();
    
    // Добавить в список выполненных
    addToCompletedList(selectedTask);
}

// Отобразить задание
function displayTask(task) {
    const taskBox = document.getElementById('taskBox');
    const taskText = document.getElementById('taskText');
    const placeholder = document.querySelector('.task-placeholder');
    
    // Скрыть плейсхолдер
    if (placeholder && placeholder.parentElement) {
        placeholder.parentElement.style.display = 'none';
    }
    
    // Показать задание
    taskText.textContent = task;
    taskBox.classList.remove('hidden');
    
    // Перезапустить анимацию
    taskBox.style.animation = 'none';
    setTimeout(() => {
        taskBox.style.animation = '';
    }, 10);
}

// Обновить счетчик
function updateTaskCounter() {
    document.getElementById('currentTask').textContent = currentTaskIndex;
}

// Добавить в список выполненных
function addToCompletedList(task) {
    const tasksList = document.getElementById('tasksList');
    const li = document.createElement('li');
    li.textContent = `${currentTaskIndex}. ${task}`;
    li.style.animation = 'slideInRight 0.5s ease-out';
    tasksList.appendChild(li);
    
    // Показать блок выполненных заданий
    document.getElementById('completedTasks').style.display = 'block';
}

// Сброс игры
function resetGame() {
    if (!confirm('Вы уверены, что хотите начать сначала?')) {
        return;
    }
    
    // Сброс переменных
    availableTasks = [...tasks];
    usedTasks = [];
    currentTaskIndex = 0;
    
    // Очистка интерфейса
    document.getElementById('tasksList').innerHTML = '';
    document.getElementById('completedTasks').style.display = 'none';
    document.getElementById('taskBox').classList.add('hidden');
    
    const placeholder = document.querySelector('.task-placeholder');
    if (placeholder && placeholder.parentElement) {
        placeholder.parentElement.style.display = 'flex';
    }
    
    // Обновить счетчик
    updateTaskCounter();
}

// Добавить стили для анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);