document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var number = document.getElementById('number').value;
    var password = document.getElementById('password').value;

    var passwordRegex = /^(?=.*\d).{8,}$/;

    if (!passwordRegex.test(password)) {
        alert('Password must be at least 8 characters long and contain at least one numeric value.');
        return;
    }

    const userData = {
        name: name,
        email: email,
        number: number,
        password: password
    };


    axios.post('http://localhost:3000/user/signup', userData)
        .then(response => {
            if (response.status === 200) {
                alert(response.data.message);
                window.location.href = '../login/login.html';  
            }
        })
        .catch(error => {
            if (error.response) {
                alert(error.response.data.message);
            } else {
                console.error('Error:', error);
            }
        });
});


document.getElementById('login-btn').addEventListener('click', function() {
    window.location.href = '../login/login.html';
});