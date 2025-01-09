import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Importing useNavigate instead of useHistory
import "../css/Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  
  const navigate = useNavigate(); // Initialize navigate for routing

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Both fields are required.");
      return;
    }

    console.log("Logging in with username:", username);  // Debug log
    try {
      const response = await fetch('http://localhost:8000/login'
        , {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);  // Debug log

      if (response.ok) {
        setMessage("Login successful! Redirecting...");
        setError("");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setError(data.error || "Invalid credentials. Please contact the admin for assistance.");
        setMessage("");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred while trying to log in. Please try again.");
      setMessage("");
    }
};


  // Function to handle "Test" button click and route to Dashboard.js
  const handleTestButtonClick = () => {
    navigate("/dashboard");  // Use navigate to route to Dashboard
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login to OncoInsight AI</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          <button type="submit" className="login-btn">Login</button>
        </form>
        <div className="admin-info">
          <p>
            Note: User accounts are managed by the admin. If you do not have access, please contact the admin.
          </p>
        </div>

        {/* Test Button */}
        <div className="test-button">
          <button onClick={handleTestButtonClick}>Test</button>
        </div>
      </div>
    </div>
  );
};

export default Login;