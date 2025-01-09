import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../css/WhatsNew.css";
import newsSvg from "../assets/news.svg"; 

const WhatsNew = () => {
  return (
    <div className="whats-new-page">
      <Header /> {/* Reuse Header component */}

      <div className="whats-new-content">
        <div className="whats-new-container">
          <h1 className="whats-new-heading">What's New at OncoInsight</h1>
          <p className="whats-new-intro">
            Stay updated with the latest features, improvements, and advancements in OncoInsight AI. We are continuously evolving to empower healthcare professionals in delivering the best patient care.
          </p>
        </div>
        
        <div className="news-icon">
          <img src={newsSvg} alt="News updates" />
        </div>
      </div>

      <section className="updates-section">
        <h2 className="updates-heading">Latest Updates:</h2>
        <ul className="updates-list">
          <li>
            <strong>Advanced AI Models:</strong> Experience cutting-edge accuracy with our new breast cancer detection model, designed to improve early diagnosis and outcomes.
          </li>
          <li>
            <strong>Enhanced User Interface:</strong> Navigate effortlessly with a sleek, intuitive design tailored for healthcare professionals.
          </li>
          <li>
            <strong>Broader Cancer Coverage:</strong> We've expanded our services to include diagnosis support for lung, colon, skin, and prostate cancers.
          </li>
          <li>
            <strong>Real-Time Updates:</strong> Access up-to-date insights and predictions, thanks to our upgraded AI backend.
          </li>
        </ul>
      </section>

      <section className="cta-section">
        <h2>Have Feedback?</h2>
        <p>
          We're constantly improving based on your suggestions. Share your ideas or report issues to help us make OncoInsight even better.
        </p>
        <button className="cta-button">Contact Us</button>
      </section>

      <Footer /> {/* Reuse Footer component */}
    </div>
  );
};

export default WhatsNew;
