import React from 'react';
import '../css/Sidebar.css'; // Ensure this path is correct
import { FaTachometerAlt, FaStethoscope, FaFileAlt, FaUser, FaHeartbeat, FaQuestionCircle } from 'react-icons/fa';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="logo-dashboard">OncoInsight AI</div>
            <ul>
                <li>
                    <a href="/dashboard">
                        <FaTachometerAlt className="menu-icon" /> Dashboard
                    </a>
                </li>
                <li>
                    <a href="/cancer-diagnosis">
                        <FaStethoscope className="menu-icon" /> Cancer Diagnosis
                    </a>
                </li>
                <li>
                    <span className="menu-heading">
                        <FaFileAlt className="menu-icon" /> Patient Record
                    </span>
                    <ul className="submenu">
                        <li><a href="/patient-record/breast-cancer">Breast Cancer</a></li>
                        <li><a href="/patient-record/lung-cancer">Lung Cancer</a></li>
                        <li><a href="/patient-record/skin-cancer">Skin Cancer</a></li>
                        <li><a href="/patient-record/colorectal-cancer">Prostate Cancer</a></li>
                        <li><a href="/patient-record/colorectal-cancer">Colorectal Cancer</a></li>
                    </ul>
                </li>
                <li>
                    <a href="/detailed-report">
                        <FaHeartbeat className="menu-icon" /> Detailed Report
                    </a>
                </li>
                <li>
                    <a href="/profile">
                        <FaUser className="menu-icon" /> Profile
                    </a>
                </li>
                <li>
                    <a href="/help">
                        <FaQuestionCircle className="menu-icon" /> Help
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;

