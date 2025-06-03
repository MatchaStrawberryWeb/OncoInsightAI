import React, { useState, useEffect } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import CancerDiagnosis from './CancerDiagnosis';
import PatientRecords from './patientData/PatientRecords';
import DetailedReport from './DetailedReport';
import Profile from './Profile';
import '../css/Dashboard.css';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loginStatus);

    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Dummy cancer trend data
  const cancerTrendData = [
    { week: 'Week 1', Breast: 320, Lung: 180, Skin: 100, Prostate: 60, Colorectal: 90 },
    { week: 'Week 2', Breast: 340, Lung: 200, Skin: 110, Prostate: 70, Colorectal: 100 },
    { week: 'Week 3', Breast: 360, Lung: 210, Skin: 120, Prostate: 65, Colorectal: 95 },
    { week: 'Week 4', Breast: 400, Lung: 250, Skin: 140, Prostate: 75, Colorectal: 110 },
  ];

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '50px', padding: '10px', flex: 1 }}>
        <h1 style={{ color: '#333333' }}>Welcome back, {username || 'User'} 👋</h1>
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

        <h2 style={{ marginTop: '40px', color: '#333' }}>Cancer Diagnosis Trends</h2>
        <div className="chart-container">
          <div className="chart">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={cancerTrendData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Breast" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="Lung" stroke="#82ca9d" strokeWidth={2} />
                <Line type="monotone" dataKey="Skin" stroke="#ffc658" strokeWidth={2} />
                <Line type="monotone" dataKey="Prostate" stroke="#ff7300" strokeWidth={2} />
                <Line type="monotone" dataKey="Colorectal" stroke="#413ea0" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>


        <Routes>
          <Route path="cancer-diagnosis" element={<CancerDiagnosis />} />
          <Route path="patient-records" element={<PatientRecords />} />
          <Route path="detailed-report" element={<DetailedReport />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<p>Select an option from the sidebar.</p>} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
