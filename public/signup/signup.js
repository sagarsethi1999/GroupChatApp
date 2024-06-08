document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var number = document.getElementById('number').value;
    var password = document.getElementById('password').value;

    var passwordRegex = /^(?=.*\d).{8,}$/;

    if (!passwordRegex.test(password)) {
        alert('Password must be at least 8 characters long and contain at least one numeric value.');
        return;
    }

    axios.post('/signup', {
        username: username,
        email: email,
        number: number,
        password: password
    })
    .then(function (response) {
        alert('Signup successful!');
        window.location.href = '/login';
    })
    .catch(function (error) {
        alert('Error: ' + error.response.data);
    });
});


