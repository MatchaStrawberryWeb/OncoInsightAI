import React from 'react';
import Header from './Header';
import Footer from './Footer';
import '../css/HomePage.css';
import feature1 from '../assets/feature1.jpg';
import feature2 from '../assets/feature2.jpg';
import feature3 from '../assets/feature3.jpg';


const HomePage = () => {
  return (
    <div>
      <Header /> {/* Calling the Header component */}

      {/* Hero Section */}
      <section className="hero-section">
        <h1>Welcome to OncoInsight AI</h1>
        <p>Your trusted AI-powered tool for cancer diagnosis, treatment guidance, and patient survival prediction.</p>
      </section>

      <section className="features-section">
        <h2>Our Key Features</h2>
        <div className="features">
          <div className="feature">
            <img src={feature1} alt="Feature 1" className="feature-image" />
            <h3>Accurate Diagnosis</h3>
            <p>Using AI, we provide highly accurate cancer diagnosis to aid doctors in treatment decisions.</p>
          </div>
          <div className="feature">
            <img src={feature2} alt="Feature 2" className="feature-image" />
            <h3>Treatment Guidance</h3>
            <p>Our AI provides treatment suggestions based on the diagnosis and latest medical guidelines.</p>
          </div>
          <div className="feature">
            <img src={feature3} alt="Feature 3" className="feature-image" />
            <h3>Patient Survival Prediction</h3>
            <p>We predict patient survival chances to help doctors plan the best course of action.</p>
          </div>
        </div>
      </section>


      <Footer /> {/* Calling the Footer component */}
    </div>
  );
};

export default HomePage;
