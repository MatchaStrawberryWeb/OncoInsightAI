import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importing pages/components
import HomePage from './publicView/HomePage';
import OurServices from './publicView/OurServices';
import WhatsNew from './publicView/WhatsNew';
import AboutUs from './publicView/AboutUs';
import Login from './publicView/Login';
import Dashboard from './components/Dashboard'; // User Dashboard
import AdminDashboard from './components/AdminDashboard'; // Admin Dashboard
import CancerDiagnosis from './components/CancerDiagnosis';
import Protected from './components/Protected'; // Correct path for Protected component
import PatientRecords from './components/patientData/PatientRecords'; // Updated path
import MedicalRecords from './components/patientData/MedicalRecords';
import Report from './components/Report';
import AdminActivityLogs from './components/AdminActivityLogs';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/our-services" element={<OurServices />} />
        <Route path="/whats-new" element={<WhatsNew />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected route for admin dashboard */}
        <Route
          path="/admin-dashboard"
          element={<Protected component={AdminDashboard} requireAdmin={true} />}
          
        />
        <Route path="/admin/activity-logs" element={<AdminActivityLogs />} />
        
        {/* Protected route for user dashboard */}
        <Route
          path="/dashboard"
          element={<Protected component={Dashboard} requireAdmin={false} />}
        />

        {/* Routes for Patient Data */}
        <Route path="/cancer-diagnosis" element={<CancerDiagnosis />} />
        <Route path="/patient-data/patient-records" element={<PatientRecords />} />
        <Route path="/patient-data/medical-records" element={<MedicalRecords />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  );
};

export default App;
