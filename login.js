

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        messageDiv.innerHTML = `<p style='color: ${data.success ? 'green' : 'red'};'>${data.message}</p>`;

        if (data.success) {
            window.location.href = "project.html"; 
        }

    } catch (err) {
        console.error(err);
        messageDiv.innerHTML = "<p style='color: red;'>Error connecting to server.</p>";
    }
});







