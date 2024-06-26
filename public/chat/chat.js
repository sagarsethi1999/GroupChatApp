

// const apiUrl = 'http://localhost:3000';

// const messagesDiv = document.getElementById('chat-messages');
// const messageInput = document.getElementById('messageInput');
// const sendButton = document.getElementById('sendButton');
// const logoutButton = document.getElementById('logoutButton');




// function storeMessage(message) {
//     let messages = JSON.parse(localStorage.getItem('messages')) || [];
//     messages.push(message);
//     if (messages.length > 10) {
//         messages.shift();
//     }
//     localStorage.setItem('messages', JSON.stringify(messages));
// }

// function getStoredMessages() {
//     return JSON.parse(localStorage.getItem('messages')) || [];
// }

// async function fetchNewMessages() {
//     const token = localStorage.getItem('token');
//     if (!token) {
//         console.log('Token not found');
//         return;
//     }

//     try {
//         const storedMessages = getStoredMessages();
//         const lastMessageId = storedMessages.length > 0 ? storedMessages[storedMessages.length - 1].id : null;

//         const response = await axios.get(`${apiUrl}/chat/messages`, {
//             headers: { 'Authorization': token },
//             params: { lastMessageId: lastMessageId }
//         });

//         const newMessages = response.data.messages;
//         if (newMessages.length > 0) {
//             newMessages.forEach(message => {
//                 storeMessage(message);
//             });
//             displayMessages(newMessages);
//         }
//     } catch (error) {
//         console.error('Error fetching messages:', error);
//     }
// }

// function displayMessages(messages) {
//     const messagesDiv = document.getElementById('chat-messages');
//     messagesDiv.innerHTML = '';
//     messages.forEach(message => {
//         const messageElement = document.createElement('div');
//         const userName = message.name ? message.name : 'Unknown';
//         messageElement.textContent = `${userName}: ${message.message}`;
//         messagesDiv.appendChild(messageElement);
//     });
// }

// async function loadMessages() {
//     const storedMessages = getStoredMessages();
//     displayMessages(storedMessages);
//     await fetchNewMessages();
// }

// loadMessages(); 

// setInterval(fetchNewMessages, 1000);











// async function sendMessage(message) {
//     const token = localStorage.getItem('token');
//     if (!token) {
//         console.log('Token not found');
//         window.location.href = '../login/login.html';
//         return;
//     }

//     try {
//         await axios.post(`${apiUrl}/chat/send-message`, { message }, {
//             headers: { 'Authorization': token }
//         });
//         console.log('Message sent successfully');
//     } catch (error) {
//         console.error('Error sending message:', error);
//     }
// }

// sendButton.addEventListener('click', () => {
//     const message = messageInput.value.trim();
//     if (message) {
//         sendMessage(message);
//         messageInput.value = '';
//     }
// });

// logoutButton.addEventListener('click', () => {
//     localStorage.removeItem('token');
//     window.location.href = '../login/login.html';
// });




//above codes are for single chat
//--------------------------------------------------------------------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    const createGroupButton = document.getElementById('createGroupButton');
    const joinGroupButton = document.getElementById('joinGroupButton');
    const createGroupForm = document.getElementById('createGroupForm');
    const joinGroupForm = document.getElementById('joinGroupForm');
    const submitCreateGroupButton = document.getElementById('submitCreateGroupButton');
    const submitJoinGroupButton = document.getElementById('submitJoinGroupButton');
    const groupsList = document.getElementById('groupsList');
    const groupNameDiv = document.getElementById('groupName');
    const groupInfoButton = document.getElementById('groupInfoButton');
    const groupMembers = document.getElementById('groupMembers');
    const chatMessagesDiv = document.getElementById('chat-messages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const logoutButton = document.getElementById('logoutButton');


    let selectedGroupName = null;

    const token = localStorage.getItem('token');

    createGroupButton.addEventListener('click', () => {
        createGroupForm.style.display = 'block';
        joinGroupForm.style.display = 'none';
    });

    joinGroupButton.addEventListener('click', () => {
        joinGroupForm.style.display = 'block';
        createGroupForm.style.display = 'none';
    });

    submitCreateGroupButton.addEventListener('click', async () => {
        const groupName = document.getElementById('groupNameInput').value;
        const groupPassword = document.getElementById('groupPasswordInput').value;

        try {
            await axios.post('http://localhost:3000/groups', { name: groupName, password: groupPassword }, {
                headers: { 'Authorization': token }
            });
            alert('Group created successfully');
            createGroupForm.style.display = 'none';
            loadGroups();
        } catch (error) {
            console.error('Error creating group:', error);
            alert('Failed to create group');
        }
    });

    submitJoinGroupButton.addEventListener('click', async () => {
        const groupName = document.getElementById('joinGroupNameInput').value;
        const groupPassword = document.getElementById('joinGroupPasswordInput').value;

        try {
            await axios.post('http://localhost:3000/groups/join', { name: groupName, password: groupPassword }, {
                headers: { 'Authorization': token }
            });
            alert('Joined group successfully');
            joinGroupForm.style.display = 'none';
            loadGroups();
        } catch (error) {
            console.error('Error joining group:', error);
            alert('Failed to join group');
        }
    });

    sendButton.addEventListener('click', async () => {
        const message = messageInput.value;
        if (!message || !selectedGroupName) return;

        try {
            await axios.post('http://localhost:3000/chat/send', { message, groupName: selectedGroupName }, {
                headers: { 'Authorization': token }
            });
            messageInput.value = '';
            loadMessages(selectedGroupName);
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message');
        }
    });

    groupInfoButton.addEventListener('click', () => {
        if (selectedGroupName) {
            localStorage.setItem('selectedGroupName', selectedGroupName);
            window.location.href = '../groupinfo/groupinfo.html';
        } else {
            alert('Please select a group first');
        }
    });

    const loadGroups = async () => {
        try {
            const response = await axios.get('http://localhost:3000/groups', {
                headers: { 'Authorization': token }
            });
            groupsList.innerHTML = '';
            response.data.groups.forEach(group => {
                const groupElement = document.createElement('div');
                groupElement.textContent = group.name;
                groupElement.addEventListener('click', () => {
                    selectedGroupName = group.name;
                    groupNameDiv.firstChild.textContent = group.name;
                    document.getElementById('groupInfoButton').style.display = 'inline-block';
                    loadGroupMembers(group.name);
                    loadMessages(group.name);
                    console.log(groupNameDiv);
                    console.log(groupInfoButton);


                });
             

                groupsList.appendChild(groupElement);
            });
        } catch (error) {
            console.error('Error loading groups:', error);
            alert('Failed to load groups');
        }
    };

    const loadGroupMembers = async (groupName) => {
        try {
            const response = await axios.get(`http://localhost:3000/groups/members?groupName=${groupName}`, {
                headers: { 'Authorization': token }
            });
            console.log(response.data.members);
            groupMembers.innerHTML = '';
            const memberNames = response.data.members.map(member => `${member.name} (${member.role})`).join(', ');
            const memberElement = document.createElement('div');
            memberElement.textContent = memberNames;
            groupMembers.appendChild(memberElement);
           
        } catch (error) {
            console.error('Error loading group members:', error);
            alert('Failed to load group members');
        }
    };

    const loadMessages = async (groupName) => {
        try {
            const response = await axios.get(`http://localhost:3000/chat/messages?groupName=${groupName}`, {
                headers: { 'Authorization': token }
            });
            chatMessagesDiv.innerHTML = '';
            response.data.messages.forEach(message => {
                console.log(message);
                const messageElement = document.createElement('div');
                messageElement.textContent = `${message.user.name}: ${message.message}`;
                chatMessagesDiv.appendChild(messageElement);
            });
        } catch (error) {
            console.error('Error loading messages:', error);
            alert('Failed to load messages');
        }
    };



    const selectGroup = (groupName) => {
        groupNameDiv.textContent = groupName;
        loadMessages(groupName);
    };


    const GroupsList = document.getElementById('groupsList');
    GroupsList.addEventListener('click', (event) => {
        if (event.target.tagName === 'DIV') {
            const groupName = event.target.textContent;
            selectGroup(groupName);
        }

    });



    loadGroups();

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '../login/login.html';
    });

    setInterval(() => {
        if (selectedGroupName) {
            loadMessages(selectedGroupName);
        }
    }, 5000);
});
