document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    const userData = {
        email: email,
        password: password
    };

    axios.post('http://3.27.216.215:3000/user/login', userData)
        .then(response => {
            if (response.status === 200) {
                alert('Successfully logged in');
                const token = response.data.token;
                const username = response.data.name;
                localStorage.setItem('token', token);
                localStorage.setItem('username', username);
                window.location.href = '../chat/chat.html';  
            }
        })
        .catch(error => {
            if (error.response) {
                if (error.response.status === 404) {
                    alert('User not found');
                } else if (error.response.status === 401) {
                    alert('User not authorized');
                } else {
                    alert('Login failed');
                }
            } else {
                console.error('Error:', error);
            }
        });
});


document.getElementById('signup-btn').addEventListener('click', function() {
    window.location.href = '../signup/signup.html';
});