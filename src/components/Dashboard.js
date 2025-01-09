import React, { useEffect, useState } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom'; // Import Routes and Route
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
      <div style={{ marginLeft: '250px', padding: '20px', flex: 1 }}>
        <h1>Welcome back, {username || 'User'} 👋</h1> {/* Display the username */}
        <p>Here's the latest update from the last 7 days. Check now.</p>

        {/* Stats and other dashboard content */}
        <div className="stats-container">
          <div className="stat-card">
            <h2>10,525</h2>
            <p>Overall Visitors</p>
            <span>↑ 15.6%</span>
          </div>
          <div className="stat-card">
            <h2>5,715</h2>
            <p>Total Patients</p>
            <span>↑ 4.6%</span>
          </div>
          <div className="stat-card">
            <h2>523</h2>
            <p>Surgeries</p>
            <span>↑ 10%</span>
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
