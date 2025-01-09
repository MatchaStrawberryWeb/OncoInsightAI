import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import AboutIllustration from "../assets/about.svg"; // Import the SVG directly
import "../css/AboutUs.css";

const AboutUs = () => {
  return (
    <div>
      <Header />
      <div className="about-us-container">
        <div className="content">
          <h1>About Us</h1>
          <p>
            OncoInsight AI is committed to revolutionizing cancer care with AI-driven technology.
          </p>
          <div className="divider"></div>

          <div className="highlight-section">
            <h2>Our Mission:</h2>
            <p>
              To provide healthcare professionals with the most accurate and reliable cancer
              diagnostic tools powered by artificial intelligence.
            </p>
          </div>

          <div className="highlight-section">
            <h2>Our Vision:</h2>
            <p>
              To enhance patient outcomes and survival through precise treatment plans,
              early detection, and personalized care.
            </p>
          </div>

          <div className="divider"></div>

          <div className="team-section">
            <h2>Meet the Team:</h2>
            <p>
              Our team consists of doctors, AI researchers, and data scientists who are
              passionate about using technology to fight cancer.
            </p>
          </div>
        </div>
        <div className="svg-container">
          <img src={AboutIllustration} alt="About Illustration" className="about-svg" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
