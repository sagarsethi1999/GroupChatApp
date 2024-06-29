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
    const usernameDiv = document.getElementById('usernameDiv');

    const socket = io('http://3.27.216.215:3000');
    let selectedGroupName = null;
    let currentGroupName = null;
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('username');

    function appendMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.innerText = message;
        chatMessagesDiv.append(messageElement);
    }

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
            await axios.post('http://3.27.216.215:3000/groups', { name: groupName, password: groupPassword }, {
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
            await axios.post('http://3.27.216.215:3000/groups/join', { name: groupName, password: groupPassword }, {
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

        const messageElement = document.createElement('div');
        messageElement.innerText = `${name}: ${message}`;
        chatMessagesDiv.append(messageElement);

        socket.emit('send-chat-message', { message, name},selectedGroupName );
        messageInput.value = '';

        try {
            await axios.post('http://3.27.216.215:3000/chat/send', { message, groupName: selectedGroupName }, {
                headers: { 'Authorization': token }
            });
            messageInput.value = '';
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
            const response = await axios.get('http://3.27.216.215:3000/groups', {
                headers: { 'Authorization': token }
            });


            groupsList.innerHTML = '';
            response.data.groups.forEach(group => {
                console.log(group.name)
                const groupElement = document.createElement('div');
                groupElement.textContent = group.name;
                groupElement.addEventListener('click', () => {
                    selectedGroupName = group.name;
                    groupNameDiv.textContent = group.name;
                    document.getElementById('groupInfoButton').style.display = 'inline-block';
                    loadGroupMembers(group.name);
                    loadMessages(group.name);

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
            const response = await axios.get(`http://3.27.216.215:3000/groups/members?groupName=${groupName}`, {
                headers: { 'Authorization': token }
            });
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
            const response = await axios.get(`http://3.27.216.215:3000/chat/messages?groupName=${groupName}`, {
                headers: { 'Authorization': token }
            });
            chatMessagesDiv.innerHTML = '';
            response.data.messages.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.textContent = `${message.user.name}: ${message.message}`;
                chatMessagesDiv.appendChild(messageElement);
            });
        } catch (error) {
            console.error('Error loading messages:', error);
            alert('Failed to load messages');
        }
    };

    const GroupsList = document.getElementById('groupsList');

    GroupsList.addEventListener('click', (event) => {
        if (event.target.tagName === 'DIV') {
            const groupName = event.target.textContent;

            if (currentGroupName  !== groupName) {
               
                socket.emit('leave-group', { groupName: currentGroupName, name });
                
            }

            selectedGroupName = groupName;
            

            groupNameDiv.textContent = groupName;
            console.log('selected group name is ', selectedGroupName)
            document.getElementById('groupInfoButton').style.display = 'inline-block';
            loadGroupMembers(groupName);
            loadMessages(groupName);

            if(selectedGroupName !== currentGroupName){
                socket.emit('join-group', {groupName:selectedGroupName, name});
                currentGroupName = groupName;
            }
            

            
            

        }
    });

    loadGroups();

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '../login/login.html';
    });

    socket.emit('new-user', name);

    socket.on('chat-message', (data) => {
        const messageElement = document.createElement('div');
        messageElement.innerText = `${data.name}: ${data.message}`;
        chatMessagesDiv.append(messageElement);
    });

    socket.on('user-connected', (name) => {
        const messageElement = document.createElement('div');
        messageElement.innerText = `${name} is online`;
        messageElement.style.color = 'limegreen';
        messageElement.style.fontWeight = 'bold';
        chatMessagesDiv.append(messageElement);
    });

    socket.on('user-disconnected', (name) => {
        const messageElement = document.createElement('div');
        messageElement.innerText = `${name} went offline`;
        messageElement.style.color = 'red';
        messageElement.style.fontWeight = 'bold';
        chatMessagesDiv.append(messageElement);
    });

    

    

    
    const loadUsername = () => {
        const username = localStorage.getItem('username');
        if (username) {
            const firstName = username.split(' ')[0]; 
            usernameDiv.textContent = `Hello ${firstName}...`;
        }
    };

    loadUsername();

});



