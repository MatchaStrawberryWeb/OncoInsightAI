import React, { useState, useEffect } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom'; // Import Navigate
import Sidebar from './Sidebar'; // Sidebar with menu options
import CancerDiagnosis from './CancerDiagnosis'; // Cancer Prediction page
import PatientRecord from './PatientRecord'; // Patient Record page
import DetailedReport from './DetailedReport'; // Detailed Report page
import Profile from './Profile'; // Profile page
import '../css/Dashboard.css';

const Dashboard = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      // Redirect to login if the user is not logged in
      return <Navigate to="/login" />;
    }
  
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '50px', padding: '10px', flex: 1 }}>
        {/* Display the username */}
        <h1 style={{ color: 'teal' }}>Welcome back, {username || 'User'} 👋</h1>
        <p>Here's the latest update from the last 7 days. Check now.</p>
        <div className="stats-container">
          <div className="stat-card">
            <h2>5,715</h2>
            <p>Total Patients</p>
            <span>↑ 4.6%</span>
          </div>
          <div className="stat-card">
            <h2>3,210</h2>
            <p>Total Successful Diagnoses</p>
            <span>↑ 8.9%</span>
          </div>
          <div className="stat-card">
            <h2>405</h2>
            <p>Total Waiting Patients</p>
            <span>↓ 2.3%</span>
          </div>
        </div>

        <Routes>
          <Route path="cancer-diagnosis" element={<CancerDiagnosis />} />
          <Route path="patient-record" element={<PatientRecord />} />
          <Route path="detailed-report" element={<DetailedReport />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
