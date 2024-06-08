document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    const userData = {
        email: email,
        password: password
    };

    axios.post('http://localhost:3000/user/login', userData)
        .then(response => {
            if (response.status === 200) {
                alert('Successfully logged in');
                window.location.href = '../chat/chat.html';  
            }
        })
        .catch(error => {
            if (error.response) {
                alert('Login failed: ' + error.response.data.message);
            } else {
                console.error('Error:', error);
            }
        });
});


document.getElementById('signup-btn').addEventListener('click', function() {
    window.location.href = '../signup/signup.html';
});