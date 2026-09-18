// Хранение диалогов для разных пользователей
class DialogManager {
    constructor() {
        // Загружаем все диалоги из localStorage
        this.dialogs = JSON.parse(localStorage.getItem('allDialogs')) || {};
        this.currentUserId = null;
        this.users = messages; // Получаем список пользователей из chat.js
        this.typingTimeout = null;
        
        // Инициализация обработчиков событий
        this.initializeEventListeners();
        
        // Скрываем диалог при запуске
        this.hideDialog();
    }

    // Сохранение всех диалогов
    saveDialogs() {
        localStorage.setItem('allDialogs', JSON.stringify(this.dialogs));
    }

    // Получение сообщений конкретного диалога
    getMessages(userId) {
        return this.dialogs[userId] || [];
    }

    // Обновление состояния печатания
    updateTypingStatus(userId, isTyping) {
        const user = this.findUserById(userId);
        if (user) {
            user.isTyping = isTyping;
            displayMessages(messages); // Обновляем список чатов
        }
    }

    // Добавление сообщения в диалог
    addMessage(userId, text, isMine = true) {
        if (!this.dialogs[userId]) {
            this.dialogs[userId] = [];
        }

        const newMessage = {
            id: Date.now(),
            text: text,
            time: this.formatTime(new Date()),
            isMine: isMine
        };

        this.dialogs[userId].push(newMessage);
        this.saveDialogs();
        this.displayMessages(userId);

        // Обновляем превью в списке чатов
        const user = this.findUserById(userId);
        if (user) {
            user.text = text;
            user.time = newMessage.time;
            user.lastMessageTime = new Date().toISOString();
            
            // Если сообщение от собеседника, увеличиваем счетчик непрочитанных
            if (!isMine) {
                user.unreadCount = (user.unreadCount || 0) + 1;
            }
            
            // Убираем статус печатания при отправке сообщения
            user.isTyping = false;
            displayMessages(messages);
        }
    }

    // Форматирование времени
    formatTime(date) {
        return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }

    // Отображение сообщений конкретного диалога
    displayMessages(userId) {
        const messagesContainer = document.getElementById('dialogMessages');
        messagesContainer.innerHTML = '';
        
        const messages = this.getMessages(userId);
        messages.forEach(message => {
            const messageHTML = this.createMessageHTML(message);
            messagesContainer.appendChild(messageHTML);
        });
        
        // Прокрутка к последнему сообщению
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Создание HTML сообщения
    createMessageHTML(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `dialog-message ${message.isMine ? 'sent' : 'received'}`;
        
        messageDiv.innerHTML = `
            <div class="message-bubble">${message.text}</div>
            <div class="message-time">${message.time}</div>
        `;
        
        return messageDiv;
    }

    // Скрытие диалога
    hideDialog() {
        document.querySelector('.dialog-box').style.display = 'none';
    }

    // Показ диалога
    showDialog() {
        document.querySelector('.dialog-box').style.display = 'flex';
    }

    // Открытие диалога с пользователем
    openDialog(userId) {
        const user = this.findUserById(userId);
        if (!user) return;

        // Показываем диалог
        this.showDialog();

        // Убираем активный класс у предыдущего диалога
        const prevActive = document.querySelector('.message-item.active');
        if (prevActive) {
            prevActive.classList.remove('active');
        }

        // Добавляем активный класс новому диалогу
        const currentChat = document.querySelector(`[data-user-id="${userId}"]`);
        if (currentChat) {
            currentChat.classList.add('active');
        }

        // Обновляем текущего пользователя
        this.currentUserId = userId;

        // Сбрасываем счетчик непрочитанных сообщений
        user.unreadCount = 0;

        // Обновляем заголовок диалога
        this.updateDialogHeader(user);

        // Отображаем сообщения
        this.displayMessages(userId);
        
        // Обновляем список чатов
        displayMessages(messages);
    }

    // Обновление заголовка диалога
    updateDialogHeader(user) {
        document.querySelector('.dialog-box-header-info-text-name').textContent = user.sender;
        document.querySelector('.avatar').src = user.avatar;
        document.querySelector('.dialog-box-header-info-text-status').textContent = 
            user.isOnline ? 'Online' : 'Offline';
    }

    // Поиск пользователя по ID
    findUserById(userId) {
        return this.users.find(m => m.id.toString() === userId.toString());
    }

    // Инициализация обработчиков событий
    initializeEventListeners() {
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendMessage');

        const sendMessage = () => {
            const text = messageInput.value.trim();
            if (text && this.currentUserId) {
                // Убираем статус печатания перед отправкой
                this.updateTypingStatus(this.currentUserId, false);
                this.addMessage(this.currentUserId, text);
                messageInput.value = '';
                
                // Имитация ответа собеседника
                setTimeout(() => {
                    // Показываем, что собеседник печатает
                    this.updateTypingStatus(this.currentUserId, true);
                    
                    // Через некоторое время отправляем ответ
                    setTimeout(() => {
                        const responses = [
                            'Thank you, I am fine, are you okay?',
                            'I am busy right now, I will dial later',
                            'Okay, I got it',
                            'Correctly'
                        ];
                        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                        // Убираем статус печатания перед отправкой ответа
                        this.updateTypingStatus(this.currentUserId, false);
                        this.addMessage(this.currentUserId, randomResponse, false);
                    }, 2000); // Печатает 2 секунды
                }, 1000); // Начинает печатать через секунду
            }
        };

        // Обработка ввода текста для статуса печатания
        messageInput.addEventListener('input', () => {
            if (this.currentUserId) {
                // Очищаем предыдущий таймер
                clearTimeout(this.typingTimeout);
                
                // Устанавливаем статус печатания
                this.updateTypingStatus(this.currentUserId, true);
                
                // Убираем статус печатания через 2 секунды после последнего ввода
                this.typingTimeout = setTimeout(() => {
                    this.updateTypingStatus(this.currentUserId, false);
                }, 2000);
            }
        });

        sendButton.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        document.getElementById('chatMessages').addEventListener('click', (e) => {
            const chatItem = e.target.closest('.message-item');
            if (chatItem) {
                const userId = chatItem.dataset.userId;
                this.openDialog(userId);
            }
        });
    }
}

// Создаем экземпляр менеджера диалогов при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.dialogManager = new DialogManager();
}); 