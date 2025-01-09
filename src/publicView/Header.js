import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faHandsHelping, faNewspaper, faInfoCircle, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import '../css/Header.css'; 


const Header = () => {
  return (
    <nav className="navbar">
      <div className="logo">OncoInsight AI</div>
      <ul className="nav-links">
        <li>
          <a href="/">
            <FontAwesomeIcon icon={faHome} /> Home
          </a>
        </li>
        <li>
          <a href="/our-services">
            <FontAwesomeIcon icon={faHandsHelping} /> Our Services
          </a>
        </li>
        <li>
          <a href="/whats-new">
            <FontAwesomeIcon icon={faNewspaper} /> What's New
          </a>
        </li>
        <li>
          <a href="/about-us">
            <FontAwesomeIcon icon={faInfoCircle} /> About Us
          </a>
        </li>
        <li>
          <a href="/login">
            <FontAwesomeIcon icon={faSignInAlt} /> Login
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
