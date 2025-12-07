// document.getElementById('forgotPasswordForm').addEventListener('submit', function(event) {
//     event.preventDefault(); 
//     const email = document.getElementById('forgotEmail').value;
//     const securityAnswerInput = document.getElementById('securityAnswerInput').value;
//     const newPassword = document.getElementById('newPassword').value;
//     const resetMessageDiv = document.getElementById('resetMessage');

   
//     const storedSecurityAnswer = localStorage.getItem(email + "_securityAnswer");

   
//     if (storedSecurityAnswer && storedSecurityAnswer === securityAnswerInput) {
      
//         localStorage.setItem(email + "_password", newPassword);
//         resetMessageDiv.innerHTML = "<p style='color: green;'>Password reset successful!</p>";
//     } else {
//         resetMessageDiv.innerHTML = "<p style='color: red;'>Invalid email or security answer.</p>";
//     }
    
// });



document.getElementById('forgotPasswordForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('forgotEmail').value;
    const securityAnswerInput = document.getElementById('securityAnswerInput').value;
    const newPassword = document.getElementById('newPassword').value;
    const resetMessageDiv = document.getElementById('resetMessage');

    try {
        const response = await fetch('/api/forgot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                securityAnswer: securityAnswerInput,
                newPassword
            })
        });

        const data = await response.json();
        resetMessageDiv.innerHTML = `<p style='color: ${data.success ? 'green' : 'red'};'>${data.message}</p>`;

    } catch (err) {
        console.error(err);
        resetMessageDiv.innerHTML = "<p style='color: red;'>Error connecting to server.</p>";
    }
});




