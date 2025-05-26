import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Both fields are required.");
      return;
    }

    console.log("Logging in with username:", username);
    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (response.ok) {
        // access_token contains username
        const loggedInUsername = data.access_token;

        // Derive role from username
        let role = null;
        if (loggedInUsername.startsWith('doctor')) {
          role = 'doctor';
        } else if (loggedInUsername.startsWith('nurse')) {
          role = 'nurse';
        } else if (loggedInUsername === 'admin') {
          role = 'admin';
        }

        localStorage.setItem('token', loggedInUsername);  
        localStorage.setItem("userRole", role);
        localStorage.setItem('username', loggedInUsername);  
        localStorage.setItem('isLoggedIn', true);    

        // Display success message and redirect
        if (role === "admin") {
          setMessage("Admin login successful! Redirecting...");
          setTimeout(() => {
            navigate("/admin-dashboard");
          }, 1500);
        } else {
          setMessage("Login successful! Redirecting...");
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        }

        setError("");  // Clear any previous error messages
      } else {
        setError(data.detail || "Invalid credentials. Please contact the admin.");
        setMessage("");  // Clear success message on error
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred while trying to log in. Please try again.");
      setMessage("");  // Clear success message on error
    }
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

      </div>
    </div>
  );
};

export default Login;
