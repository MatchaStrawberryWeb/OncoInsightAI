import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importing pages/components
import HomePage from './publicView/HomePage';
import OurServices from './publicView/OurServices';
import WhatsNew from './publicView/WhatsNew';
import AboutUs from './publicView/AboutUs';
import Login from './publicView/Login';
import Dashboard from './components/Dashboard'; // Dashboard component
import CancerDiagnosis from './components/CancerDiagnosis';
import Protected from './components/Protected'; // Ensure the correct path for Protected component

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
        
        {/* Protected Route for Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <Protected component={Dashboard} /> // Protect the route with the Protected component
          }
        />

        <Route path="/cancer-diagnosis" element={<CancerDiagnosis />} />
      </Routes>
    </Router>
  );
};

export default App;
