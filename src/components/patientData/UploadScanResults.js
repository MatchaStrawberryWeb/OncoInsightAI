import React, { useState } from "react";
import axios from "axios";
import '../css/UploadScanResults.css';

const UploadScanResults = () => {
  const [patientData, setPatientData] = useState({
    icNumber: "",
    fullName: "",
    age: "",
    gender: "",
  });

  const [file, setFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientData({ ...patientData, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && !selectedFile.type.startsWith("image/")) {
      setErrorMessage("Please upload a valid image file.");
      setFile(null);
    } else {
      setErrorMessage("");
      setFile(selectedFile);
    }
  };

  const registerPatient = async () => {
    try {
      const response = await axios.post("/api/register-patient", patientData);
      return response.data.patient_id; // Assuming `patient_id` is returned on success
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || "Failed to register patient.");
      throw error;
    }
  };

  const uploadScan = async (patientId) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("patient_id", patientId);

    try {
      const response = await axios.post("/api/upload-scan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccessMessage(response.data.message);
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || "Failed to upload scan.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const patientId = await registerPatient();
      if (patientId) {
        await uploadScan(patientId);
      }
    } catch (error) {
      // Errors are handled within registerPatient and uploadScan
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-scan-results">
      <h2>Upload Scan Results</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="icNumber"
          placeholder="IC Number"
          value={patientData.icNumber}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={patientData.fullName}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={patientData.age}
          onChange={handleInputChange}
          required
        />
        <select
          name="gender"
          value={patientData.gender}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input type="file" onChange={handleFileChange} required />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Register and Upload"}
        </button>
      </form>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default UploadScanResults;
