import React, { useState } from "react";
import '../../css/PatientRecords.css'
import Sidebar from "../Sidebar";

const PatientRecords = () => {
  const [icNumber, setIcNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [diseases, setDiseases] = useState({
    diabetes: "No",
    highBloodPressure: "No",
    heartDisease: "No",
    asthma: "No"
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedDetails, setSubmittedDetails] = useState(null);

  const handleDiseaseChange = (disease, value) => {
    setDiseases((prev) => ({ ...prev, [disease]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("ic_number", icNumber);
    formData.append("full_name", fullName);
    formData.append("age", age);
    formData.append("gender", gender);
    formData.append("file", selectedFile);
    Object.entries(diseases).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/register-patient", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setSubmittedDetails({
          ic_number: icNumber,
          full_name: fullName,
          age: age,
          gender: gender,
          file_name: selectedFile?.name || "No file uploaded",
          ...diseases
        });
        setSuccessMessage(data.message || "Patient data and file uploaded successfully!");
        setErrorMessage("");
      } else {
        setErrorMessage(data.detail || "Failed to upload patient data.");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("An error occurred while uploading patient data.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="upload-scan-page">
      <Sidebar />
      <div className="upload-scan-results">
        <h2>Patient Records</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>IC Number:</label>
            <input type="text" value={icNumber} onChange={(e) => setIcNumber(e.target.value)} required />
          </div>
          <div>
            <label>Full Name:</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div>
            <label>Age:</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
          </div>
          <div>
            <label>Gender:</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Disease Questions */}
          {Object.keys(diseases).map((disease) => (
            <div key={disease}>
              <label>{disease.replace(/([A-Z])/g, ' $1').trim()}:</label>
              <label>
                <input type="radio" name={disease} value="Yes" checked={diseases[disease] === "Yes"} onChange={() => handleDiseaseChange(disease, "Yes")} /> Yes
              </label>
              <label>
                <input type="radio" name={disease} value="No" checked={diseases[disease] === "No"} onChange={() => handleDiseaseChange(disease, "No")} /> No
              </label>
            </div>
          ))}

          <div>
            <label>Upload File:</label>
            <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
          </div>
          <button type="submit">Submit</button>
        </form>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {submittedDetails && (
          <div className="submitted-details">
            <h3>Submitted Patient Details:</h3>
            <p>IC Number: {submittedDetails.ic_number}</p>
            <p>Full Name: {submittedDetails.full_name}</p>
            <p>Age: {submittedDetails.age}</p>
            <p>Gender: {submittedDetails.gender}</p>
            <p>File Uploaded: {submittedDetails.file_name}</p>
            <h4>Diseases:</h4>
            {Object.entries(submittedDetails).map(([key, value]) => (
              diseases[key] !== undefined && <p key={key}>{key.replace(/([A-Z])/g, ' $1').trim()}: {value}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientRecords;
