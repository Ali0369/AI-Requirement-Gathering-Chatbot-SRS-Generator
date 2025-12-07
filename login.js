// document.getElementById('loginForm').addEventListener('submit', function(event) {
//     event.preventDefault(); 


    
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
//     const messageDiv = document.getElementById('message');



//     const storedPassword = localStorage.getItem(email + "_password");


    
//     if (storedPassword && storedPassword === password) {
//         messageDiv.innerHTML = "<p style='color: green;'>Login successful!</p>";
//         window.location.href = "project.html"; 
//     } else {
//         messageDiv.innerHTML = "<p style='color: red;'>Invalid email or password. Please register.</p>";
//     }  
// });  

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
            window.location.href = "project.html"; // redirect on success
        }

    } catch (err) {
        console.error(err);
        messageDiv.innerHTML = "<p style='color: red;'>Error connecting to server.</p>";
    }
});






