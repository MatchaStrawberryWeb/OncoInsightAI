import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../css/CancerDiagnosis.css";
import { useNavigate } from "react-router-dom";

const CancerDiagnosis = () => {
  const [icNumber, setIcNumber] = useState("");
  const [patientDetails, setPatientDetails] = useState(null);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [survivalPrediction, setSurvivalPrediction] = useState(null);
  const [treatmentGuidance, setTreatmentGuidance] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const mockPatients = {
    991201072122: { full_name: "Nurul Maymay", age: 26, gender: "Female" },
    841231080624: { full_name: "Patricia Garcia", age: 41, gender: "Female" },
    901101022118: { full_name: "Sarah Tan", age: 35, gender: "Female" },
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Determine cancer stage based on patient age
      const age = patientDetails?.age;
      let cancerLevel = "Unknown";
      if (age >= 40) {
        cancerLevel = "Stage 4";
      } else if (age >= 30) {
        cancerLevel = "Stage 2";
      } else {
        cancerLevel = "Early Stage";
      }

      // Mk result data
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay
      const mockResult = {
        cancerType: "Breast Cancer",
        cancerLevel,
      };
      setResult(mockResult);
    } catch (error) {
      console.error("Error submitting diagnosis:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkPatient = async () => {
    setLoading(true);
    try {
      const patient = mockPatients[icNumber];
      if (patient) {
        setPatientDetails(patient);
      } else {
        alert("Patient not found");
        setPatientDetails(null);
      }
    } catch (error) {
      console.error("Error fetching patient details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePredictSurvival = () => {
    const age = patientDetails?.age;
    let mockSurvivalData;

    if (age >= 40) {
      mockSurvivalData = {
        survivalRate: "50%",
        prognosis:
          "Follow rigorous treatment protocols and frequent monitoring.",
      };
    } else if (age >= 30) {
      mockSurvivalData = {
        survivalRate: "85%",
        prognosis: "Follow treatment plan and regular check-ups.",
      };
    } else {
      mockSurvivalData = {
        survivalRate: "100%",
        prognosis: "Maintain a healthy lifestyle and regular monitoring.",
      };
    }

    setSurvivalPrediction(mockSurvivalData);
  };

  const handleTreatmentGuidance = () => {
    const age = patientDetails?.age;
    let mockTreatmentData;

    if (age >= 40) {
      mockTreatmentData = {
        treatmentType: "Advanced Cancer Treatment Package by Hospital",
        recommendedDrugs: ["Drug X", "Drug Y"],
        treatmentDuration: "12 months",
      };
    } else if (age >= 30) {
      mockTreatmentData = {
        treatmentType: "Standard Treatment Package by Hospital",
        recommendedDrugs: ["Drug A", "Drug B"],
        treatmentDuration: "6 months",
      };
    } else {
      mockTreatmentData = {
        treatmentType: "Early Stage Plan Package by Hospital",
        recommendedDrugs: [],
        treatmentDuration: "Monitor regularly with lifestyle changes.",
      };
    }

    setTreatmentGuidance(mockTreatmentData);
  };

  return (
    <div className="diagnosis-container">
      <Sidebar />
      <div className="content">
        <h1>Cancer Diagnosis</h1>
        <form onSubmit={handleSubmit} className="diagnosis-form">
          <div className="form-group">
            <label>IC Number:</label>
            <input
              type="text"
              value={icNumber}
              onChange={(e) => setIcNumber(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={checkPatient}
              className="check-button"
            >
              {loading ? "Checking..." : "Check"}
            </button>
          </div>
          {patientDetails && (
            <div className="patient-details">
              <h3>Patient Details</h3>
              <p>
                <strong>Name:</strong> {patientDetails.full_name}
              </p>
              <p>
                <strong>Age:</strong> {patientDetails.age}
              </p>
              <p>
                <strong>Gender:</strong> {patientDetails.gender}
              </p>
            </div>
          )}
          {patientDetails && (
            <div>
              <div className="form-group">
                <label>Upload Scan:</label>
                <input type="file" onChange={handleFileChange} required />
              </div>
              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          )}
        </form>

        {result && (
          <div className="result">
            <h2>Diagnosis Results</h2>
            <p>
              <strong>Cancer Type:</strong> {result.cancerType}
            </p>
            <p>
              <strong>Cancer Level:</strong> {result.cancerLevel}
            </p>

            <button
              className="predict-survival-button"
              onClick={handlePredictSurvival}
            >
              Predict Survival
            </button>
            <button
              className="treatment-guidance-button"
              onClick={handleTreatmentGuidance}
            >
              Treatment Guidance
            </button>

            {survivalPrediction && (
              <div className="survival-prediction">
                <h3>Survival Prediction</h3>
                <p>
                  <strong>Survival Rate:</strong>{" "}
                  {survivalPrediction.survivalRate}
                </p>
                <p>
                  <strong>Prognosis:</strong> {survivalPrediction.prognosis}
                </p>
              </div>
            )}

            {treatmentGuidance && (
              <div className="treatment-guidance">
                <h3>Treatment Guidance</h3>
                <p>
                  <strong>Treatment Type:</strong>{" "}
                  {treatmentGuidance.treatmentType}
                </p>
                <p>
                  <strong>Recommended Drugs:</strong>{" "}
                  {treatmentGuidance.recommendedDrugs.join(", ")}
                </p>
                <p>
                  <strong>Treatment Duration:</strong>{" "}
                  {treatmentGuidance.treatmentDuration}
                </p>
              </div>
            )}

            {result && (
              <button
                className="view-report-button"
                onClick={() =>
                  navigate("/report", {
                    state: {
                      patientDetails,
                      diagnosis: result,
                      survivalPrediction,
                      treatmentGuidance,
                    },
                  })
                }
              >
                View Report
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CancerDiagnosis;
