import React, { useState } from "react";
import '../css/Help.css';
import Sidebar from "./Sidebar";

const Help = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      subject,
      message,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/log-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || "Report submitted successfully.");
        setErrorMessage("");
        setSubject("");
        setMessage("");
      } else {
        setErrorMessage(data.detail || "Failed to submit the report.");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("An error occurred while submitting the report.");
      setSuccessMessage("");
    }
  };

  const handleEmailAdmin = () => {
    window.location.href = "mailto:admin@oncoinsight.com";
  };

  return (
    <div className="help-page">
      <Sidebar />
      <div className="help-content">
        <h2>Help & Support</h2>
        <p>If you need any assistance, feel free to reach out to the admin directly or submit a report using the form below.</p>
        
        <button className="email-admin" onClick={handleEmailAdmin}>Contact Admin via Email</button>
        
        <h3>Log a Report</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Subject:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Message:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="5"
              required
            ></textarea>
          </div>
          <button type="submit">Submit Report</button>
        </form>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Help;
