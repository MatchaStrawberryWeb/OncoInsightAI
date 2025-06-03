import React, { useState, useEffect } from 'react';
import '../css/Sidebar.css';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import {
    FaTachometerAlt,
    FaStethoscope,
    FaFileAlt,
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


    const [dateTime, setDateTime] = useState("");
    const userRole = localStorage.getItem("userRole");

    const canAccess = (menu) => {
        if (userRole === "doctor") {
            // doctor access rules
            const doctorMenus = [
                "dashboard",
                "cancer-diagnosis",
                "detailed-report",
                "profile",
                "help",
            ];
            return doctorMenus.includes(menu);
        } else if (userRole === "nurse") {
            // nurse access rules
            const nurseMenus = [
                "dashboard",
                "patient-data",
                "detailed-report",
                "profile",
                "help",
            ];
            return nurseMenus.includes(menu);
        }
        return false; // default deny
    };

    useEffect(() => {
        const updateTime = () => {
            const malaysiaTime = new Date().toLocaleString("en-MY", {
                timeZone: "Asia/Kuala_Lumpur",
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            });
            setDateTime(malaysiaTime);
        };

        updateTime(); // initial call
        const intervalId = setInterval(updateTime, 1000); // update every second

        return () => clearInterval(intervalId); // cleanup on unmount
    }, []);

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
        <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            {/* Sidebar Header Section */}
            <div className="top-section">
                <button className="toggle-btn" onClick={toggleSidebar}>
                    <FaBars />
                </button>

                {!collapsed && (
                    <div className="logo-dashboard">
                        <img src={logo} alt="OncoInsight Logo" className="logo-img" />
                        <span className="logo-text">OncoInsight AI</span>
                    </div>
                )}

                <ul className="menu">
                    <li>
                        <Link
                            to="/dashboard"
                            onClick={e => !canAccess("dashboard") && e.preventDefault()}
                            style={{ pointerEvents: canAccess("dashboard") ? "auto" : "none", color: canAccess("dashboard") ? "inherit" : "gray" }}
                        >
                            <FaTachometerAlt className="menu-icon" />
                            {!collapsed && <span>Dashboard</span>}
                        </Link>
                    </li>

                    <li>
                        <span
                            className="menu-heading"
                            onClick={e => {
                                if (!canAccess("patient-data")) e.preventDefault();
                                else togglePatientData();
                            }}
                            style={{ pointerEvents: canAccess("patient-data") ? "auto" : "none", color: canAccess("patient-data") ? "inherit" : "gray", cursor: canAccess("patient-data") ? "pointer" : "default" }}
                        >
                            <FaFileAlt className="menu-icon" />
                            {!collapsed && <span>Patient Data</span>}
                            {!collapsed && (patientDataCollapsed ? <FaCaretDown /> : <FaCaretUp />)}
                        </span>
                        {!collapsed && !patientDataCollapsed && canAccess("patient-data") && (
                            <ul className="submenu">
                                <li><Link to="/patient-data/patient-records">Patient Records</Link></li>
                                <li><Link to="/patient-data/medical-records">Medical Records</Link></li>
                            </ul>
                        )}
                    </li>

                    <li>
                        <Link
                            to="/cancer-diagnosis"
                            onClick={e => !canAccess("cancer-diagnosis") && e.preventDefault()}
                            style={{ pointerEvents: canAccess("cancer-diagnosis") ? "auto" : "none", color: canAccess("cancer-diagnosis") ? "inherit" : "gray" }}
                        >
                            <FaStethoscope className="menu-icon" />
                            {!collapsed && <span>Cancer Diagnosis</span>}
                        </Link>
                        {!collapsed && canAccess("cancer-diagnosis") && (
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
                        <Link
                            to="/detailed-report"
                            onClick={e => !canAccess("detailed-report") && e.preventDefault()}
                            style={{ pointerEvents: canAccess("detailed-report") ? "auto" : "none", color: canAccess("detailed-report") ? "inherit" : "gray" }}
                        >
                            <FaHeartbeat className="menu-icon" />
                            {!collapsed && <span>Detailed Report</span>}
                        </Link>
                    </li>

                </ul>
            </div >

            {/* Top-Right Links */}
            < div className="top-right-links" >
                <div className="malaysia-time" style={{ color: "black", fontWeight: "500" }}>
                    {dateTime}
                </div>

                <Link
                    to="/help"
                    onClick={(e) => !canAccess("help") && e.preventDefault()}
                    style={{
                        pointerEvents: canAccess("help") ? "auto" : "none",
                        color: canAccess("help") ? "black" : "gray",
                        textDecoration: "none",
                        fontWeight: "500"
                    }}
                >
                    <FaQuestionCircle className="menu-icon" /> Help
                </Link>

                <button onClick={handleLogout} className="logout-button">
                    <FaSignOutAlt className="menu-icon" /> Logout
                </button>
            </div >
        </div >
    );
}


export default Sidebar;
