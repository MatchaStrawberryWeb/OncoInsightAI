import React, { useState, useEffect } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom'; // Import Navigate
import Sidebar from './Sidebar'; // Sidebar with menu options
import CancerDiagnosis from './CancerDiagnosis'; // Cancer Prediction page
import PatientRecords from './patientData/PatientRecords';
import DetailedReport from './DetailedReport'; // Detailed Report page
import Profile from './Profile'; // Profile page
import '../css/Dashboard.css';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default is logged in; adjust if needed

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loginStatus);

    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Redirect to login page if user is not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

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

        {/* Routes for Dashboard */}
        <Routes>
          <Route path="cancer-diagnosis" element={<CancerDiagnosis />} />
          <Route path="patient-records" element={<PatientRecords />} />
          <Route path="detailed-report" element={<DetailedReport />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<p>Select an option from the sidebar.</p>} /> {/* Default route */}
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
