import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importing pages/components
import HomePage from "./publicView/HomePage";
import OurServices from "./publicView/OurServices";
import WhatsNew from "./publicView/WhatsNew";
import AboutUs from "./publicView/AboutUs";
import Login from "./publicView/Login";
import Dashboard from "./components/Dashboard"; // User Dashboard
import AdminDashboard from "./components/AdminDashboard"; // Admin Dashboard
import CancerDiagnosis from "./components/CancerDiagnosis";
import Protected from "./components/Protected"; // Correct path for Protected component
import PatientRecords from "./components/patientData/PatientRecords"; // Updated path
import MedicalRecords from "./components/patientData/MedicalRecords";
import Report from "./components/Report";
import AdminActivityLogs from "./components/AdminActivityLogs";
import Profile from "./components/Profile";
import Help from "./components/Help";
import BreastCancer from "./components/BreastCancer";
import LungCancer from "./components/LungCancer";
import ProstateCancer from "./components/ProstateCancer";
import SkinCancer from "./components/SkinCancer";
import ColorectalCancer from "./components/ColorectalCancer";

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

        <Route path="/profile" element={<Profile />} />
        <Route path="/help" element={<Help />} />

        {/* Routes for Patient Data */}
        <Route path="/cancer-diagnosis" element={<CancerDiagnosis />} />
        <Route
          path="/patient-data/patient-records"
          element={<PatientRecords />}
        />
        <Route
          path="/patient-data/medical-records"
          element={<MedicalRecords />}
        />
        <Route path="/report" element={<Report />} />

        <Route path="/breast-cancer" element={<BreastCancer />} />
        <Route path="/lung-cancer" element={<LungCancer />} />
        <Route path="/prostate-cancer" element={<ProstateCancer />} />
        <Route path="/skin-cancer" element={<SkinCancer />} />
        <Route path="/colorectal-cancer" element={<ColorectalCancer />} />
      </Routes>
    </Router>
  );
};

export default App;
