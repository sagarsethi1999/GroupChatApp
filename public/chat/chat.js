const apiUrl = 'http://localhost:3000';

const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const logoutButton = document.getElementById('logoutButton');

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
