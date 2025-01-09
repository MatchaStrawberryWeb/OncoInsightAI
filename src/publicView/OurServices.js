import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../css/OurServices.css";
import servicesSvg from "../assets/services.svg"; // Import the SVG

const OurServices = () => {
  return (
    <div>
      <Header /> {/* Header Component */}

      <div className="services-container">
        {/* SVG Illustration */}
        <img src={servicesSvg} alt="Services Illustration" className="services-svg" />

        {/* Introduction Section */}
        <section className="services-intro">
          <h2 className="intro-heading">Empowering Healthcare with AI</h2>
          <p className="intro-text">
            At OncoInsight, we harness the transformative power of artificial intelligence to address critical challenges in oncology. Our mission is to provide healthcare professionals with tools that enable accurate and early cancer detection. By combining innovative algorithms with clinical expertise, we are paving the way for more precise diagnoses and effective treatments. Our platform integrates seamlessly into medical workflows, ensuring minimal disruption while maximizing impact. We believe that technology should enhance, not replace, the human touch in healthcare. From identifying subtle patterns in medical data to providing actionable insights, our AI solutions are designed to empower doctors and nurses. With OncoInsight, healthcare providers can make more informed decisions that lead to better patient outcomes. Join us on our journey to revolutionize oncology and redefine what's possible with AI in medicine.
          </p>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="features-heading">Our Key Services</h2>
          <div className="feature-cards">

            <div className="feature-card">
              <h3>Accurate Cancer Diagnosis</h3>
              <p>
                Our platform leverages state-of-the-art algorithms to ensure early and precise detection of various types of cancer, including breast, lung, colon, skin, and prostate cancers. By analyzing complex medical data with unparalleled accuracy, we help healthcare providers identify malignancies at their earliest stages. Early detection is crucial in improving survival rates and enhancing the quality of life for patients. Our AI systems are trained on diverse datasets to ensure robustness and reliability across different populations. Whether it’s detecting subtle anomalies in imaging data or identifying patterns in patient histories, our technology leaves no stone unturned. We collaborate with leading oncologists to continually refine our diagnostic models. Our goal is to support medical professionals in making accurate diagnoses that instill confidence in patients and their families. With OncoInsight, early intervention is not just a possibility but a promise.
              </p>
            </div>

            <div className="feature-card">
              <h3>Personalized Treatment Plans</h3>
              <p>
                Every patient is unique, and so should their treatment plans be. At OncoInsight, we utilize AI-driven insights to craft personalized care strategies tailored to each individual’s needs. Our platform analyzes a multitude of factors, including genetic profiles, medical histories, and treatment responses, to recommend the most effective options. By integrating patient-specific data, we empower healthcare providers to move beyond one-size-fits-all approaches. Our AI continuously learns from real-world outcomes, ensuring that recommendations remain up-to-date with the latest medical advancements. Personalized treatment not only improves efficacy but also minimizes potential side effects, enhancing the overall patient experience. Collaboration with leading researchers and clinicians ensures that our models are both scientifically sound and clinically relevant. With OncoInsight, precision medicine becomes an attainable reality for healthcare institutions worldwide. Together, we are shaping the future of personalized oncology care.
              </p>
            </div>
            <div className="feature-card">
              <h3>Proactive Survival Predictions</h3>
              <p>
                Planning for the future is an integral part of effective healthcare. Our survival prediction models provide healthcare providers with insights that enable proactive planning for patient care. By analyzing vast amounts of medical data, our AI estimates survival probabilities and identifies factors influencing outcomes. These predictions help doctors and nurses engage in meaningful conversations with patients and their families, fostering transparency and trust. Our tools are designed to support holistic care by considering both clinical and emotional aspects of patient management. We ensure that survival predictions are delivered with sensitivity and backed by scientific rigor. Proactive insights also allow healthcare teams to allocate resources more effectively, ensuring that patients receive the right care at the right time. At OncoInsight, we believe that knowledge empowers action. Our survival predictions are a step toward providing patients with the dignity and care they deserve, even in challenging circumstances.
              </p>
            </div>
          </div>
        </section>

        {/* Additional Insights Section */}
        <section className="insights-section">
          <h2>Why Choose OncoInsight?</h2>
          <ul className="insights-list">
            <li>
              <strong>Trusted by Professionals:</strong> Our platform is trusted by leading oncologists and healthcare institutions worldwide, ensuring credibility and reliability in critical clinical applications. We work closely with experts to validate our solutions, making them dependable in real-world scenarios.
            </li>
            <li>
              <strong>Data-Driven Decisions:</strong> Our AI models are built on a foundation of extensive data, ensuring that every insight is backed by evidence. By leveraging big data analytics, we enable clinicians to make decisions that are both informed and impactful.
            </li>
            <li>
              <strong>Continuous Improvement:</strong> The field of oncology is constantly evolving, and so are we. Our AI systems are designed to adapt and improve with the latest research, ensuring that healthcare providers always have access to cutting-edge tools.
            </li>
          </ul>
        </section>
      </div>

      <Footer /> {/* Footer Component */}
    </div>
  );
};

export default OurServices;
