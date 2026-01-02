// Русский алфавит без запрещённых букв
const alphabet = [
    'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 
    'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 
    'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Э', 'Ю', 'Я'
];

// История выбранных букв
let letterHistory = [];
let totalCount = 0;

// Генерация случайной буквы
function generateLetter() {
    // Выбрать случайную букву
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    const selectedLetter = alphabet[randomIndex];
    
    // Показать букву
    displayLetter(selectedLetter);
    
    // Добавить в историю
    addToHistory(selectedLetter);
    
    // Обновить счётчик
    totalCount++;
    document.getElementById('totalLetters').textContent = totalCount;
}

// Отобразить букву
function displayLetter(letter) {
    const letterBox = document.getElementById('letterBox');
    const letterText = document.getElementById('letterText');
    const placeholder = document.querySelector('.letter-placeholder');
    
    // Скрыть плейсхолдер
    if (placeholder && placeholder.parentElement) {
        placeholder.parentElement.style.display = 'none';
    }
    
    // Показать букву
    letterText.textContent = letter;
    letterBox.classList.remove('hidden');
    
    // Перезапустить анимацию
    letterBox.style.animation = 'none';
    setTimeout(() => {
        letterBox.style.animation = '';
    }, 10);
}

// Добавить в историю
function addToHistory(letter) {
    letterHistory.push(letter);
    
    const historyContainer = document.getElementById('lettersHistory');
    const letterElement = document.createElement('div');
    letterElement.className = 'history-letter';
    letterElement.textContent = letter;
    
    // Добавить подсказку при наведении
    letterElement.title = `Выбрана ${getLetterOccurrence(letter)} раз(а)`;
    
    historyContainer.appendChild(letterElement);
    
    // Показать секцию истории
    document.getElementById('historySection').style.display = 'block';
    
    // Прокрутить к новой букве
    setTimeout(() => {
        letterElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Получить количество появлений буквы
function getLetterOccurrence(letter) {
    return letterHistory.filter(l => l === letter).length;
}

// Дополнительные функции для управления игрой

// Сброс истории (можно добавить кнопку)
function resetHistory() {
    if (!confirm('Очистить историю выбранных букв?')) {
        return;
    }
    
    letterHistory = [];
    totalCount = 0;
    document.getElementById('lettersHistory').innerHTML = '';
    document.getElementById('totalLetters').textContent = '0';
    document.getElementById('historySection').style.display = 'none';
}

// Статистика по буквам (можно добавить отдельную кнопку)
function showStatistics() {
    if (letterHistory.length === 0) {
        alert('История пуста. Выберите хотя бы одну букву.');
        return;
    }
    
    const stats = {};
    letterHistory.forEach(letter => {
        stats[letter] = (stats[letter] || 0) + 1;
    });
    
    const sortedStats = Object.entries(stats)
        .sort((a, b) => b[1] - a[1])
        .map(([letter, count]) => `${letter}: ${count} раз(а)`)
        .join('\n');
    
    alert(`Статистика выбранных букв:\n\n${sortedStats}`);
}

// Инициализация при загрузке
window.onload = function() {
    // Можно добавить приветственное сообщение
    console.log('Игра "Спой песню на букву" загружена');
    console.log(`Доступно букв: ${alphabet.length}`);
    console.log('Запрещённые буквы: Ь, Ъ, Й, Ы');
};