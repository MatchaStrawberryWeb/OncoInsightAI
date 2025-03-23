import React, { useState } from 'react';
import '../css/Sidebar.css';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { 
    FaTachometerAlt, 
    FaStethoscope, 
    FaFileAlt, 
    FaUser, 
    FaHeartbeat, 
    FaQuestionCircle, 
    FaBars, 
    FaCaretDown, 
    FaCaretUp,
    FaSignOutAlt
} from 'react-icons/fa';


const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(true); // Sidebar starts collapsed
    const [patientDataCollapsed, setPatientDataCollapsed] = useState(true); // Patient Data submenu starts collapsed

    const toggleSidebar = () => {
        setCollapsed(!collapsed); // Toggle collapse state of the sidebar
    };

    const togglePatientData = () => {
        setPatientDataCollapsed(!patientDataCollapsed); // Toggle collapse state of the Patient Data submenu
    };

    const handleLogout = () => {
        // Clear user data (e.g., token)
        localStorage.removeItem("authToken"); // Example: Clear token from localStorage
        alert("You have been logged out.");
        window.location.href = "/login"; // Redirect to login page
    };
    

    return (
        <>
            {/* Sidebar Section */}
            <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                <div className="top-section">
                    <button className="toggle-btn" onClick={toggleSidebar}>
                        <FaBars />
                    </button>
                    {!collapsed && <div className="logo-dashboard">OncoInsight AI</div>}
                </div>

                <ul className="menu">
                    <li>
                        <Link to="/dashboard">
                            <FaTachometerAlt className="menu-icon" />
                            {!collapsed && <span>Dashboard</span>}
                        </Link>
                    </li>
                    <li>
                        <span className="menu-heading" onClick={togglePatientData}>
                            <FaFileAlt className="menu-icon" />
                            {!collapsed && <span>Patient Data</span>}
                            {patientDataCollapsed ? <FaCaretDown /> : <FaCaretUp />} {/* Show down/up arrow */}
                        </span>
                        {!collapsed && !patientDataCollapsed && (
                            <ul className="submenu">
                                <li><Link to="/patient-data/patient-records">Patient Records</Link></li>
                                <li><Link to="/patient-data/medical-records">Medical Records</Link></li>
                            </ul>
                        )}
                    </li>
                    <li>
                        <Link to="/cancer-diagnosis">
                            <FaStethoscope className="menu-icon" />
                            {!collapsed && <span>Cancer Diagnosis</span>}
                        </Link>
                        {!collapsed && (
                           <ul className="submenu">
                           <li><Link to="/breast-cancer">Breast Cancer</Link></li>
                           <li><Link to="/lung-cancer">Lung Cancer</Link></li>
                           <li><Link to="/prostate-cancer">Prostate Cancer</Link></li>
                           <li><Link to="/skin-cancer">Skin Cancer</Link></li>
                           <li><Link to="/colorectal-cancer">Colorectal Cancer</Link></li>
                       </ul>
                        )}
                    </li>

                    <li>
                        <Link to="/detailed-report">
                            <FaHeartbeat className="menu-icon" />
                            {!collapsed && <span>Detailed Report</span>}
                        </Link>
                    </li>
                </ul>
            </div>

           {/* Top-Right Links */}
            <div className="top-right-links">
                <Link to="/profile">
                    <FaUser className="menu-icon" /> Profile
                </Link>
                <Link to="/help">
                    <FaQuestionCircle className="menu-icon" /> Help
                </Link>
                <button onClick={handleLogout} className="logout-button">
                    <FaSignOutAlt className="menu-icon" /> Logout
                </button>
            </div>



        </>
    );
};

export default Sidebar;
