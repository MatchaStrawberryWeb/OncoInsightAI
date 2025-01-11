import React, { useState } from "react";
import '../../css/UploadScanResults.css';

const UploadScanResults = () => {
  const [patientData, setPatientData] = useState({
    icNumber: "",
    fullName: "",
    age: "",
    gender: "",
  });

  const [file, setFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submittedDetails, setSubmittedDetails] = useState(null); // To store the details after submission
  const [errorMessage, setErrorMessage] = useState("");  // Add this to define state for error message

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientData({ ...patientData, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setFile(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    const formData = new FormData();
    formData.append("ic_number", patientData.icNumber);
    formData.append("full_name", patientData.fullName);
    formData.append("age", patientData.age);
    formData.append("gender", patientData.gender);
    formData.append("file", file);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/patient", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        // Handle success: Store the submitted details to display them on the page
        setSuccessMessage("Patient data and file uploaded successfully!");
        const submittedDetails = {
          icNumber: patientData.icNumber,
          fullName: patientData.fullName,
          age: patientData.age,
          gender: patientData.gender,
          file: file.name, // You can store the file name or path here
        };
        setSubmittedDetails(submittedDetails);  // Update submitted details state
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrorMessage("Failed to upload the file. Please try again.");
      alert("Failed to upload the file. Please try again.");
    } finally {
      setLoading(false);
    }
  };
    

  return (
    <div className="upload-scan-results">
      <h2>Upload Scan Results</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="icNumber">IC Number</label>
          <input
            type="text"
            id="icNumber"
            name="icNumber"
            placeholder="Enter IC Number"
            value={patientData.icNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Enter Full Name"
            value={patientData.fullName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            placeholder="Enter Age"
            value={patientData.age}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={patientData.gender}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label htmlFor="scanFile">Upload Scan File</label>
          <input
            type="file"
            id="scanFile"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Register and Upload"}
        </button>
      </form>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}


      {/* Display submitted details */}
      {submittedDetails && (
        <div className="submitted-details">
          <h3>Submitted Patient Details:</h3>
          <p><strong>IC Number:</strong> {submittedDetails.icNumber}</p>
          <p><strong>Full Name:</strong> {submittedDetails.fullName}</p>
          <p><strong>Age:</strong> {submittedDetails.age}</p>
          <p><strong>Gender:</strong> {submittedDetails.gender}</p>
          <p><strong>File Uploaded:</strong> {submittedDetails.file}</p>
        </div>
      )}
    </div>
  );
};

export default UploadScanResults;
