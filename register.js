
document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const securityAnswer = document.getElementById('securityAnswer').value;
    const messageDiv = document.getElementById('registerMessage');

    if (password !== confirmPassword) {
        messageDiv.innerHTML = "<p style='color: red;'>Passwords do not match!</p>";
        return;
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, securityAnswer })
        });

        const data = await response.json();
        messageDiv.innerHTML = `<p style='color: ${data.success ? 'green' : 'red'};'>${data.message}</p>`;

    } catch (err) {
        console.error(err);
        messageDiv.innerHTML = "<p style='color: red;'>Error connecting to server.</p>";
    }
});


