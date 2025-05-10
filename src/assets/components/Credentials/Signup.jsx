import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import loginImage from "/src/assets/photos/login.png";


const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      setSuccess("Account created successfully!");

      setTimeout(() => {
        navigate("/login");
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signup-container">
      {/* Left Form Section */}
      <div className="signup-left">
        <h2>Create an Account</h2>
        <p>Enter your email and password to get started</p>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleSubmit}>
          <label>Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="signup-button">Sign Up</button>
        </form>

        <p className="login-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>

      {/* Right Illustration Section */}
      <div className="signup-right">
        <img src={loginImage} alt="Login art" />
      </div>
    </div>
  );
};

export default Signup;
