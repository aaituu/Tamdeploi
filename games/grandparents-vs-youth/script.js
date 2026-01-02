// Предметы для молодёжи (старые предметы)
const itemsForYouth = [
    {
        icon: "📟",
        name: "Пейджер",
        answer: "ПЕЙДЖЕР",
        description: "Устройство для получения коротких текстовых сообщений, популярное в 90-х годах"
    },
    {
        icon: "📼",
        name: "Видеокассета",
        answer: "ВИДЕОКАССЕТА (VHS)",
        description: "Магнитная лента для записи и воспроизведения видео"
    },
    {
        icon: "☎️",
        name: "Дисковый телефон",
        answer: "ДИСКОВЫЙ ТЕЛЕФОН",
        description: "Телефон с круговым диском для набора номера"
    },
    {
        icon: "📻",
        name: "Бобинный магнитофон",
        answer: "БОБИННЫЙ МАГНИТОФОН",
        description: "Устройство для записи и воспроизведения звука на магнитную ленту"
    },
    {
        icon: "💾",
        name: "Дискета",
        answer: "ДИСКЕТА (ФЛОППИ-ДИСК)",
        description: "Магнитный носитель данных, популярный в 80-90-х годах"
    },
    {
        icon: "📠",
        name: "Факс",
        answer: "ФАКСИМИЛЬНЫЙ АППАРАТ (ФАКС)",
        description: "Устройство для передачи документов по телефонной линии"
    },
    {
        icon: "📺",
        name: "Телевизор с антеннами",
        answer: "ЛАМПОВЫЙ ТЕЛЕВИЗОР",
        description: "Старый телевизор с электронно-лучевой трубкой и антеннами-рожками"
    },
    {
        icon: "⏰",
        name: "Механический будильник",
        answer: "МЕХАНИЧЕСКИЙ БУДИЛЬНИК",
        description: "Часы-будильник с заводным механизмом и звоночками"
    },
    {
        icon: "🎞️",
        name: "Фотоплёнка",
        answer: "ФОТОПЛЁНКА",
        description: "Светочувствительная плёнка для аналоговых фотоаппаратов"
    },
    {
        icon: "📖",
        name: "Телефонная книга",
        answer: "ТЕЛЕФОННЫЙ СПРАВОЧНИК",
        description: "Печатная книга с телефонными номерами жителей города"
    }
];

// Предметы для старшего поколения (современные предметы)
const itemsForElders = [
    {
        icon: "🎧",
        name: "AirPods",
        answer: "БЕСПРОВОДНЫЕ НАУШНИКИ (AIRPODS)",
        description: "Беспроводные Bluetooth-наушники от Apple"
    },
    {
        icon: "🤳",
        name: "Селфи-палка",
        answer: "СЕЛФИ-ПАЛКА (МОНОПОД)",
        description: "Раздвижная палка для съёмки селфи на расстоянии"
    },
    {
        icon: "💳",
        name: "Бесконтактная карта",
        answer: "БЕСКОНТАКТНАЯ БАНКОВСКАЯ КАРТА",
        description: "Карта с чипом NFC для оплаты прикосновением"
    },
    {
        icon: "🎮",
        name: "VR-очки",
        answer: "VR-ОЧКИ (ВИРТУАЛЬНАЯ РЕАЛЬНОСТЬ)",
        description: "Очки для погружения в виртуальную реальность"
    },
    {
        icon: "🔋",
        name: "Павербанк",
        answer: "ПАВЕРБАНК (ВНЕШНИЙ АККУМУЛЯТОР)",
        description: "Портативное зарядное устройство для мобильных гаджетов"
    },
    {
        icon: "📱",
        name: "QR-код",
        answer: "QR-КОД",
        description: "Двумерный штрих-код для быстрого считывания информации смартфоном"
    },
    {
        icon: "🎙️",
        name: "Умная колонка",
        answer: "УМНАЯ КОЛОНКА (АЛИСА, ALEXA)",
        description: "Колонка с голосовым ассистентом для управления умным домом"
    },
    {
        icon: "⌚",
        name: "Смарт-часы",
        answer: "СМАРТ-ЧАСЫ",
        description: "Часы с функциями фитнес-трекера и уведомлений со смартфона"
    },
    {
        icon: "🛴",
        name: "Электросамокат",
        answer: "ЭЛЕКТРОСАМОКАТ",
        description: "Самокат с электрическим двигателем для городских поездок"
    },
    {
        icon: "📷",
        name: "Экшн-камера",
        answer: "ЭКШН-КАМЕРА (GOPRO)",
        description: "Компактная камера для съёмки экстремальных видео"
    }
];

let currentMode = 'youth';
let currentItems = [];
let currentIndex = 0;
let answerShown = false;
let correctAnswers = 0;
let gameStarted = false;

// Выбор режима
function selectMode(mode) {
    currentMode = mode;
    
    // Обновить кнопки
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.target.classList.add('active');
    
    // Сброс игры при смене режима
    if (gameStarted) {
        resetGame();
    }
}

// Начать игру
function startGame() {
    gameStarted = true;
    currentIndex = 0;
    correctAnswers = 0;
    answerShown = false;
    
    // Выбрать предметы в зависимости от режима
    currentItems = currentMode === 'youth' ? [...itemsForYouth] : [...itemsForElders];
    
    // Перемешать предметы
    currentItems.sort(() => Math.random() - 0.5);
    
    // Обновить UI
    document.getElementById('totalItems').textContent = currentItems.length;
    document.getElementById('startBtn').classList.add('hidden');
    document.getElementById('showAnswerBtn').classList.remove('hidden');
    document.getElementById('nextBtn').classList.remove('hidden');
    
    // Показать первый предмет
    loadItem(currentIndex);
}

// Загрузить предмет
function loadItem(index) {
    if (index >= currentItems.length) {
        endGame();
        return;
    }
    
    const item = currentItems[index];
    
    document.getElementById('itemIcon').textContent = item.icon;
    document.getElementById('itemName').textContent = item.name;
    document.getElementById('answerText').textContent = item.answer;
    document.getElementById('answerDescription').textContent = item.description;
    document.getElementById('currentItem').textContent = index + 1;
    
    // Скрыть ответ
    document.getElementById('answerSection').classList.add('hidden');
    document.getElementById('showAnswerBtn').textContent = '👁️ Показать ответ';
    answerShown = false;
    
    // Анимация
    const itemBox = document.getElementById('itemBox');
    itemBox.style.animation = 'none';
    setTimeout(() => {
        itemBox.style.animation = '';
    }, 10);
}

// Показать/скрыть ответ
function toggleAnswer() {
    const answerSection = document.getElementById('answerSection');
    const btn = document.getElementById('showAnswerBtn');
    
    if (answerShown) {
        answerSection.classList.add('hidden');
        btn.textContent = '👁️ Показать ответ';
        answerShown = false;
    } else {
        answerSection.classList.remove('hidden');
        btn.textContent = '🙈 Скрыть ответ';
        answerShown = true;
        
        // Спросить, был ли ответ правильным
        setTimeout(() => {
            if (confirm('Участники ответили правильно?')) {
                correctAnswers++;
                document.getElementById('correctScore').textContent = correctAnswers;
            }
        }, 500);
    }
}

// Следующий предмет
function nextItem() {
    currentIndex++;
    loadItem(currentIndex);
}

// Завершить игру
function endGame() {
    const percentage = Math.round((correctAnswers / currentItems.length) * 100);
    
    alert(`Игра окончена!\n\nПравильных ответов: ${correctAnswers} из ${currentItems.length}\nРезультат: ${percentage}%`);
    
    resetGame();
}

// Сброс игры
function resetGame() {
    gameStarted = false;
    currentIndex = 0;
    correctAnswers = 0;
    answerShown = false;
    
    document.getElementById('startBtn').classList.remove('hidden');
    document.getElementById('showAnswerBtn').classList.add('hidden');
    document.getElementById('nextBtn').classList.add('hidden');
    document.getElementById('answerSection').classList.add('hidden');
    document.getElementById('correctScore').textContent = '0';
    document.getElementById('currentItem').textContent = '1';
    
    document.getElementById('itemIcon').textContent = '🎯';
    document.getElementById('itemName').textContent = 'Выберите режим и нажмите "Начать"';
}