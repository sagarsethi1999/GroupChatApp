document.addEventListener('DOMContentLoaded', () => {
    const groupNameElement = document.getElementById('groupName');
    const groupMembersElement = document.getElementById('groupMembers');
    const addMemberInput = document.getElementById('addMemberInput');
    const addMemberButton = document.getElementById('addMemberButton');
    const removeMemberInput = document.getElementById('removeMemberInput');
    const removeMemberButton = document.getElementById('removeMemberButton');
    const makeAdminInput = document.getElementById('makeAdminInput');
    const makeAdminButton = document.getElementById('makeAdminButton');
    const backButton = document.getElementById('backButton');
    const adminActions = document.getElementById('adminActions');

    const token = localStorage.getItem('token');
    const selectedGroupName = localStorage.getItem('selectedGroupName');

    if (!selectedGroupName) {
        alert('No group selected');
        window.location.href = '../chat/chat.html';
        return;
    }

    groupNameElement.textContent = selectedGroupName;

    const loadGroupMembers = async () => {
        try {
            const response = await axios.get(`http://3.27.216.215:3000/groups/members?groupName=${selectedGroupName}`, {
                headers: { 'Authorization': token }
            });
            groupMembersElement.innerHTML = '';
            response.data.members.forEach(member => {
                const memberElement = document.createElement('div');
                memberElement.textContent = `${member.name} (${member.role})`;
                groupMembersElement.appendChild(memberElement);
            });

            const currentUserResponse = await axios.get(`http://3.27.216.215:3000/user/me?groupName=${selectedGroupName}`, {
                headers: { 'Authorization': token }
            });
            const currentUser = currentUserResponse.data.user;
            const currentUserRole = currentUserResponse.data.role;

            if (currentUserRole === 'admin') {
                adminActions.style.display = 'block';
            }
        } catch (error) {
            console.error('Error loading group members:', error);
            alert('Failed to load group members');
        }
    };

    addMemberButton.addEventListener('click', async () => {
        const memberIdentifier = addMemberInput.value;
        if (!memberIdentifier) return;

        try {
            await axios.post('http://3.27.216.215:3000/groups/addMember', {
                groupName: selectedGroupName,
                memberIdentifier
            }, {
                headers: { 'Authorization': token }
            });
            addMemberInput.value = '';
            loadGroupMembers();
        } catch (error) {
            console.error('Error adding member:', error);
            alert('Failed to add member');
        }
    });

    removeMemberButton.addEventListener('click', async () => {
        const memberName = removeMemberInput.value;
        if (!memberName) return;

        try {
            await axios.post('http://3.27.216.215:3000/groups/removeMember', {
                groupName: selectedGroupName,
                memberName
            }, {
                headers: { 'Authorization': token }
            });
            removeMemberInput.value = '';
            loadGroupMembers();
        } catch (error) {
            console.error('Error removing member:', error);
            alert('Failed to remove member');
        }
    });

    makeAdminButton.addEventListener('click', async () => {
        const memberName = makeAdminInput.value;
        if (!memberName) return;

        try {
            await axios.post('http://3.27.216.215:3000/groups/makeAdmin', {
                groupName: selectedGroupName,
                memberName
            }, {
                headers: { 'Authorization': token }
            });
            makeAdminInput.value = '';
            loadGroupMembers();
        } catch (error) {
            console.error('Error making member admin:', error);
            alert('Failed to make member admin');
        }
    });

    backButton.addEventListener('click', () => {
        window.location.href = '../chat/chat.html';
    });

    loadGroupMembers();
});
