const apiUrl = 'http://localhost:3000';

const messagesDiv = document.getElementById('chat-messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const logoutButton = document.getElementById('logoutButton');

async function fetchMessages() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('Token not found');
        return;
    }

    try {
        const response = await axios.get(`${apiUrl}/chat/messages`, {
            headers: { 'Authorization': token }
        });

        const messages = response.data.messages;
        messagesDiv.innerHTML = '';
        messages.forEach(message => {
            const userName = message.user.name;
            const messageElement = document.createElement('div');
            messageElement.textContent = `${userName}: ${message.message}`;
            messagesDiv.appendChild(messageElement);
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

setInterval(fetchMessages, 1000);

async function sendMessage(message) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('Token not found');
        window.location.href = '../login/login.html';
        return;
    }

    try {
        await axios.post(`${apiUrl}/chat/send-message`, { message }, {
            headers: { 'Authorization': token }
        });
        console.log('Message sent successfully');
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        sendMessage(message);
        messageInput.value = '';
    }
});

logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '../login/login.html';
});
