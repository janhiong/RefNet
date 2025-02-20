document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.querySelector("form[method='POST']");
    const loginForm = document.querySelector("form[method='post']");

    if (signupForm) {
        signupForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            
            const username = document.querySelector("input[name='user_name']").value;
            const password = document.querySelector("input[name='password']").value;
            const email = document.querySelector("input[name='name']").value; // Assuming 'name' is the email field.

            const response = await fetch("http://localhost:3000/api/v1/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password, email }),
            });

            const data = await response.json();
            if (data.success) {
                alert("Signup successful!");
                window.location.href = "login.html";
            } else {
                alert(data.message);
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const username = document.querySelector("input[name='user_name']").value;
            const password = document.querySelector("input[name='password']").value;

            const response = await fetch("http://localhost:3000/api/v1/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: username, password }), // Backend expects 'email' field
            });

            const data = await response.json();
            if (data.success) {
                alert("Login successful!");
                window.location.href = "dashboard.html"; // Redirect to a dashboard or home page
            } else {
                alert(data.message);
            }
        });
    }
});
