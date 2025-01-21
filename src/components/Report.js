import React from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable"; // For table-based PDF layouts
import "../css/Report.css"; // Import external CSS

const Report = () => {
  const location = useLocation();

  const {
    patientDetails = {
      full_name: "Unknown",
      age: "Unknown",
      gender: "Unknown",
    },
    diagnosis = { cancerType: "Unknown", cancerLevel: "Unknown" },
    survivalPrediction = { survivalRate: "N/A", prognosis: "N/A" },
    treatmentGuidance = {
      treatmentType: "N/A",
      recommendedDrugs: [],
      treatmentDuration: "N/A",
      hospitalPlan: "N/A",
    },
  } = location.state || {};

  const handlePrintReport = () => {
    window.print();
  };

  // Generate PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Patient Report", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text("Patient Details", 10, 40);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${patientDetails.full_name}`, 10, 50);
    doc.text(`Age: ${patientDetails.age}`, 10, 60);
    doc.text(`Gender: ${patientDetails.gender}`, 10, 70);

    doc.setFont("helvetica", "bold");
    doc.text("Cancer Diagnosis", 10, 90);
    doc.setFont("helvetica", "normal");
    doc.text(`Cancer Type: ${diagnosis.cancerType}`, 10, 100);
    doc.text(`Cancer Level: ${diagnosis.cancerLevel}`, 10, 110);

    doc.setFont("helvetica", "bold");
    doc.text("Survival Prediction", 10, 130);
    doc.setFont("helvetica", "normal");
    doc.text(`Survival Rate: ${survivalPrediction.survivalRate}`, 10, 140);
    doc.text(`Prognosis: ${survivalPrediction.prognosis}`, 10, 150);

    doc.setFont("helvetica", "bold");
    doc.text("Treatment Guidance", 10, 170);
    doc.setFont("helvetica", "normal");
    doc.text(`Treatment Type: ${treatmentGuidance.treatmentType}`, 10, 180);
    doc.text(
      `Recommended Drugs: ${treatmentGuidance.recommendedDrugs.join(", ")}`,
      10,
      190
    );
    doc.text(
      `Treatment Duration: ${treatmentGuidance.treatmentDuration}`,
      10,
      200
    );
    doc.text(`Hospital Plan: ${treatmentGuidance.hospitalPlan}`, 10, 210);

    doc.save("Patient_Report.pdf");
  };

  // Export CSV
  const exportToCSV = () => {
    const csvContent = `
        Patient Details:
        Name,${patientDetails.full_name}
        Age,${patientDetails.age}
        Gender,${patientDetails.gender}

        Cancer Diagnosis:
        Cancer Type,${diagnosis.cancerType}
        Cancer Level,${diagnosis.cancerLevel}

        Survival Prediction:
        Survival Rate,${survivalPrediction.survivalRate}
        Prognosis,${survivalPrediction.prognosis}

        Treatment Guidance:
        Treatment Type,${treatmentGuidance.treatmentType}
        Recommended Drugs,${treatmentGuidance.recommendedDrugs.join("; ")}
        Treatment Duration,${treatmentGuidance.treatmentDuration}
        Hospital Plan,${treatmentGuidance.hospitalPlan}
        `;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Patient_Report.csv";
    link.click();
  };

  return (
    <div className="report-container">
      <div className="report">
        <h1 className="header">Patient Report</h1>
        <hr className="divider" />

        <section className="section">
          <h2>Patient Details</h2>
          <p>
            <strong>Name:</strong> {patientDetails.full_name}
          </p>
          <p>
            <strong>Age:</strong> {patientDetails.age}
          </p>
          <p>
            <strong>Gender:</strong> {patientDetails.gender}
          </p>
        </section>

        <section className="section">
          <h2>Cancer Diagnosis</h2>
          <p>
            <strong>Cancer Type:</strong> {diagnosis.cancerType}
          </p>
          <p>
            <strong>Cancer Level:</strong> {diagnosis.cancerLevel}
          </p>
        </section>

        <section className="section">
          <h2>Survival Prediction</h2>
          <p>
            <strong>Survival Rate:</strong> {survivalPrediction.survivalRate}
          </p>
          <p>
            <strong>Prognosis:</strong> {survivalPrediction.prognosis}
          </p>
        </section>

        <section className="section">
          <h2>Treatment Guidance</h2>
          <p>
            <strong>Treatment Type:</strong> {treatmentGuidance.treatmentType}
          </p>
          <p>
            <strong>Recommended Drugs:</strong>{" "}
            {treatmentGuidance.recommendedDrugs.join(", ")}
          </p>
          <p>
            <strong>Treatment Duration:</strong>{" "}
            {treatmentGuidance.treatmentDuration}
          </p>
          <p>
            <strong>Hospital Plan:</strong> {treatmentGuidance.hospitalPlan}
          </p>
        </section>
      </div>

      <div className="button-container">
        <button className="export-button" onClick={exportToPDF}>
          Export to PDF
        </button>
        <button className="export-button" onClick={exportToCSV}>
          Export to CSV
        </button>
        <button className="export-button" onClick={handlePrintReport}>
          Print Report
        </button>
      </div>
    </div>
  );
};

export default Report;
