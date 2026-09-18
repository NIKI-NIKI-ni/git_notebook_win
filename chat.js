// Пример данных сообщений
const messages = [
    {
        id: 1,
        sender: 'Charles Caldwell',
        text: '',
        time: '16:45',
        avatar: './img/avatar1.jpg',
        frequency: 8,
        status: 'read',
        isMine: true,
        isOnline: true,
        isTyping: false,
        isPinned: true,
        unread: false
    },
    {
        id: 2,
        sender: 'Mark Barrett',
        text: '',
        time: '16:43',
        avatar: './img/avatar2.jpg',
        frequency: 5,
        status: 'received',
        isMine: false,
        isOnline: true,
        isTyping: true,
        isPinned: true,
        unread: true
    },
    {
        id: 3,
        sender: 'Joel Miller',
        text: '',
        time: '16:40',
        avatar: './img/avatar3.jpg',
        frequency: 7,
        status: 'delivered',
        isMine: false,
        isOnline: false,
        isTyping: false,
        isPinned: false,
        unread: true
    },
    {
        id: 4,
        sender: 'Joanne Hunt',
        text: '',
        time: '16:35',
        avatar: './img/avatar4.jpg',
        frequency: 3,
        status: 'received',
        isMine: false,
        isOnline: true,
        isTyping: false,
        isPinned: false,
        unread: false
    },
    {
        id: 5,
        sender: 'Carol Bryant',
        text: '',
        time: '16:35',
        avatar: './img/avatar5.jpg',
        frequency: 3,
        status: 'received',
        isMine: false,
        isOnline: true,
        isTyping: false,
        isPinned: false,
        unread: false
    },
    {
        id: 6,
        sender: 'Mary Gordon',
        text: '',
        time: '16:35',
        avatar: './img/avatar6.jpg',
        frequency: 3,
        status: 'received',
        isMine: false,
        isOnline: true,
        isTyping: false,
        isPinned: false,
        unread: false
    },
    {
        id: 7,
        sender: 'Benjamin Carter',
        text: '',
        time: '16:35',
        avatar: './img/avatar7.jpg',
        frequency: 3,
        status: 'received',
        isMine: false,
        isOnline: true,
        isTyping: false,
        isPinned: false,
        unread: false
    },
    {
        id: 8,
        sender: 'Catherine Thomas',
        text: '',
        time: '16:35',
        avatar: './img/avatar8.jpg',
        frequency: 3,
        status: 'received',
        isMine: false,
        isOnline: true,
        isTyping: false,
        isPinned: false,
        unread: false
    },
    {
        id: 9,
        sender: 'Tony Owens',
        text: '',
        time: '16:35',
        avatar: './img/avatar9.jpg',
        frequency: 3,
        status: 'received',
        isMine: false,
        isOnline: true,
        isTyping: false,
        isPinned: false,
        unread: false
    },
    {
        id: 10,
        sender: 'Tom Berry',
        text: '',
        time: '16:35',
        avatar: './img/avatar10.jpg',
        frequency: 3,
        status: 'received',
        isMine: false,
        isOnline: true,
        isTyping: false,
        isPinned: false,
        unread: false
    },
    {
        id: 11,
        sender: 'Alan Adkins',
        text: '',
        time: '16:35',
        avatar: './img/avatar11.jpg',
        frequency: 3,
        status: 'received',
        isMine: false,
        isOnline: true,
        isTyping: false,
        isPinned: false,
        unread: false
    },
    {
        id: 12,
        sender: 'Donna Peterson',
        text: '',
        time: '16:35',
        avatar: './img/avatar12.jpg',
        frequency: 3,
        status: 'received',
        isMine: false,
        isOnline: true,
        isTyping: false,
        isPinned: false,
        unread: false
    }

];

// Функция для получения HTML статуса сообщения
function getMessageStatusHTML(status, isMine) {
    if (!isMine) {
        return '<span class="message-status received">✓✓</span>';
    }

    switch (status) {
        case 'read':
            return '<span class="message-status read">✓✓</span>';
        case 'delivered':
            return '<span class="message-status delivered">✓✓</span>';
        case 'received':
            return '<span class="message-status">✓</span>';
        default:
            return '';
    }
}

// Функция для отображения текста сообщения
function getMessageText(message) {
    // Если пользователь печатает, показываем индикатор набора текста
    if (message.isTyping) {
        return '<span class="typing-text">... is typing</span>';
    }
    
    // Если есть текст, показываем его
    if (message.text) {
        return message.text;
    }
    
    // Если нет текста, показываем пустое пространство
    return '';
}

// Функция для отображения сообщений
function displayMessages(filteredMessages) {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';

    // Сначала отсортируем сообщения: закрепленные сверху, затем по времени последнего сообщения
    const sortedMessages = [...filteredMessages].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        if (!a.lastMessageTime && !b.lastMessageTime) return 0;
        if (!a.lastMessageTime) return 1;
        if (!b.lastMessageTime) return -1;
        return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
    });

    sortedMessages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message-item';
        messageElement.dataset.userId = message.id;
        
        if (message.unread && !message.isMine) {
            messageElement.classList.add('unread');
        }

        const statusHTML = getMessageStatusHTML(message.status, message.isMine);
        const messageText = getMessageText(message);
        const pinnedIcon = message.isPinned ? '<span class="pinned-icon"><i class="fas fa-thumbtack"></i></span>' : '';
        const onlineStatus = message.isOnline ? '<span class="online-status online"></span>' : '<span class="online-status offline"></span>';
        
        // Добавляем индикатор непрочитанных сообщений
        const unreadCount = message.unreadCount || 0;
        const unreadBadge = unreadCount > 0 ? 
            `<span class="unread-badge">${unreadCount}</span>` : '';

        messageElement.innerHTML = `
            <div class="avatar-container">
                <img src="${message.avatar}" alt="${message.sender}" class="message-avatar">
                ${onlineStatus}
            </div>
            <div class="message-content">
                <div class="message-sender">${pinnedIcon}${message.sender}</div>
                <div class="message-text${message.isTyping ? ' typing' : ''}">${messageText}</div>
            </div>
            <div class="message-info">
                ${unreadBadge}
                ${statusHTML}
                <div class="message-time">${message.time}</div>
            </div>
        `;

        // Добавляем обработчик клика для открытия диалога
        messageElement.addEventListener('click', () => {
            if (window.dialogManager) {
                window.dialogManager.openDialog(message.id);
            }
        });

        chatMessages.appendChild(messageElement);
    });
}

// Функция поиска
function searchMessages(query) {
    return messages.filter(message =>
        message.sender.toLowerCase().includes(query.toLowerCase()) ||
        message.text.toLowerCase().includes(query.toLowerCase())
    );
}

// Функция сортировки
function sortMessages(messages, sortType) {
    const sortedMessages = [...messages];
    switch (sortType) {
        case 'newest':
            return sortedMessages.reverse();
        case 'oldest':
            return sortedMessages;
        case 'frequent':
            return sortedMessages.sort((a, b) => b.frequency - a.frequency);
        default:
            return sortedMessages;
    }
}

// Обработчики событий
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');

    // Начальное отображение
    displayMessages(messages);

    // Обработка поиска
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        const filteredMessages = searchMessages(query);
        const sortedMessages = sortMessages(filteredMessages, sortSelect.value);
        displayMessages(sortedMessages);
    });

    // Обработка сортировки
    sortSelect.addEventListener('change', (e) => {
        const query = searchInput.value;
        const filteredMessages = searchMessages(query);
        const sortedMessages = sortMessages(filteredMessages, e.target.value);
        displayMessages(sortedMessages);
    });
}); 