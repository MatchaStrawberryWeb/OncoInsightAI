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
    FaCaretUp 
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
                                <li><Link to="/patient-data/upload-scan-results">Upload Scan Results</Link></li>
                                <li><Link to="/patient-data/update-patient-records">Update Patient Records</Link></li>
                                <li><Link to="/patient-data/view-history">View Patient History</Link></li>
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
                                <li><Link to="/cancer-diagnosis/breast-cancer">Breast Cancer</Link></li>
                                <li><Link to="/cancer-diagnosis/lung-cancer">Lung Cancer</Link></li>
                                <li><Link to="/cancer-diagnosis/prostate-cancer">Prostate Cancer</Link></li>
                                <li><Link to="/cancer-diagnosis/skin-cancer">Skin Cancer</Link></li>
                                <li><Link to="/cancer-diagnosis/colorectal-cancer">Colorectal Cancer</Link></li>
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
            </div>
        </>
    );
};

export default Sidebar;
