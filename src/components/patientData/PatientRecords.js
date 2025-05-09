import React, { useState } from "react";
import '../../css/PatientRecords.css';
import Sidebar from "../Sidebar";

const PatientRecords = () => {
  const [ic, setIcNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    blood_type: "",
    diabetes: "",
    high_blood_pressure: "",
    heart_disease: "",
    asthma: "",
    allergies: "",
    medications: "",
    surgeries: "",
    family_history: "",
    smoking: "",
    alcohol: "",
    hearing_right: "",
    hearing_left: "",
    eyesight_right: "",
    eyesight_left: "",
    visual_aid_right: "",
    visual_aid_left: "",
    color_vision: "",
    urinalysis: "",
    ecg: "",
    xray: "",
    emergency_contact_name: "",
    emergency_contact_number: "",
    relationship_to_emergency_contacts: ""
  });


  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedDetails, setSubmittedDetails] = useState(null);

  const handleIcChange = (e) => {
    const ic = e.target.value;
    setIcNumber(ic);

    if (ic.length >= 12) {
      const yearPrefix = ic.substring(0, 2);
      let birthYear = parseInt(yearPrefix, 10);

      if (birthYear >= 50) {
        birthYear += 1900;
      } else {
        birthYear += 2000;
      }

      const currentYear = new Date().getFullYear();
      const calculatedAge = currentYear - birthYear;
      setAge(calculatedAge);

      const lastDigit = parseInt(ic[ic.length - 1]);
      setGender(lastDigit % 2 === 0 ? "Female" : "Male");
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let diabetesLevel = "Normal";
    if (formData.diabetes) {
      const val = parseFloat(formData.diabetes);
      if (val < 70) diabetesLevel = "Low";
      else if (val > 125) diabetesLevel = "High";
    }

    let bpLevel = "Normal";
    if (formData.high_blood_pressure) {
      const val = parseFloat(formData.high_blood_pressure);
      if (val < 90) bpLevel = "Low";
      else if (val > 140) bpLevel = "High";
    }

    const form = new FormData();
    form.append("ic", ic);
    form.append("fullName", fullName);
    form.append("age", age);
    form.append("gender", gender);
    form.append("uploaded_file", selectedFile);

    form.append("diabetes", `${formData.diabetes} (${diabetesLevel})`);
    form.append("high_blood_pressure", `${formData.high_blood_pressure} (${bpLevel})`);

    form.append("contact_name", formData.contact_name);
    form.append("contact_number", formData.contact_number);
    form.append("relation_to_patient", formData.relation_to_patient);


    // Append remaining fields (if any others exist in formData)
    for (const [key, value] of Object.entries(formData)) {
      if (
        key !== "diabetes" &&
        key !== "high_blood_pressure" &&
        key !== "emergency_contact_name" &&
        key !== "emergency_contact_number" &&
        key !== "relationship_to_emergency_contacts"
      ) {
        form.append(key, value);
      }
    }

    try {
      const response = await fetch("http://localhost:8000/api/patients/", {
        method: "POST",
        body: form
      });

      let data;
      try {
        data = await response.json();
      } catch {
        const text = await response.text();
        data = { detail: text };
      }

      if (response.ok) {
        setSubmittedDetails({
          ic: ic,
          full_name: fullName,
          age,
          gender,
          file_name: selectedFile?.name || "No file uploaded",
          ...formData,
          diabetes: `${formData.diabetes} (${diabetesLevel})`,
          high_blood_pressure: `${formData.high_blood_pressure} (${bpLevel})`
        });
        setSuccessMessage(data.message || "Patient data and file uploaded successfully!");
        setErrorMessage([]);  // clear previous error messages
      } else {
        let messages = ["Failed to upload patient data."];

        if (Array.isArray(data.detail)) {
          messages = data.detail.map(e => {
            const field = Array.isArray(e.loc) ? e.loc.at(-1) : "field";
            return `${field}: ${e.msg}`;
          });
        } else if (typeof data.detail === "object" && data.detail !== null) {
          messages = [data.detail.msg || JSON.stringify(data.detail)];
        } else if (typeof data.detail === "string") {
          messages = [data.detail];
        }

        setErrorMessage(messages);
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage(["An error occurred while uploading patient data."]);
      setSuccessMessage("");
    }
  }

  return (
    <div className="patient-records">
      <Sidebar />
      <div className="patient-records-content">
        <h2>Patient Records</h2>
        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <h3 className="section-title">Basic Information</h3>

            <div className="form-group">
              <label>IC Number:</label>
              <input
                type="text"
                value={ic}
                onChange={handleIcChange}
                placeholder="e.g., 991201072122"
                required
              />
            </div>

            <div className="form-group">
              <label>Full Name:</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g., Full Name as per IC"
                required
              />
            </div>

            <div className="form-group">
              <label>Age:</label>
              <input type="number" value={age} readOnly />
            </div>

            <div className="form-group">
              <label>Gender:</label>
              <input type="text" value={gender} readOnly />
            </div>
          </div>

          {/* Vitals */}
          <div className="grid grid-cols-2 gap-4">
            <h3 className="section-title">Vitals</h3>

            <div className="form-group">
              <label>Height (cm):</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Weight (kg):</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Blood Type:</label>
              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          {/* Medical History */}
          <div className="grid grid-cols-2 gap-4">
            <h3 className="section-title">Medical History</h3>

            <div className="form-group">
              <label>Diabetes (Fasting Blood Sugar - mg/dL):</label>
              <input
                type="number"
                name="diabetes"
                value={formData.diabetes}
                onChange={handleChange}
                placeholder="e.g. 85"
              />
            </div>
            <div className="form-group">
              <label>Medications:</label>
              <input
                type="text"
                name="medications"
                value={formData.medications}
                onChange={handleChange}
                placeholder="e.g., Metformin, Aspirin"
              />
            </div>

            <div className="form-group">
              <label>High Blood Pressure (Systolic - mmHg):</label>
              <input
                type="number"
                name="high_blood_pressure"
                value={formData.high_blood_pressure}
                onChange={handleChange}
                placeholder="e.g. 120"
              />
            </div>

            <div className="form-group">
              <label>Allergies:</label>
              <input
                type="text"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="e.g., Seafoods, Peanuts"
              />
            </div>

            <div className="form-group">
              <label>Heart Disease:</label>
              <input
                type="text"
                name="heart_disease"
                value={formData.heart_disease}
                onChange={handleChange}
                placeholder="e.g., Coronary artery disease"
              />
            </div>

            <div className="form-group">
              <label>Surgeries:</label>
              <input
                type="text"
                name="surgeries"
                value={formData.surgeries}
                onChange={handleChange}
                placeholder="e.g., Appendectomy in 2018"
              />
            </div>

            <div className="form-group">
              <label>Asthma:</label>
              <input
                type="text"
                name="asthma"
                value={formData.asthma}
                onChange={handleChange}
                placeholder="e.g., Mild intermittent asthma"
              />
            </div>

            <div className="form-group">
              <label>Family History:</label>
              <input
                type="text"
                name="family_history"
                value={formData.family_history}
                onChange={handleChange}
                placeholder="e.g., Father had diabetes"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Lifestyle */}
            <div>
              <h3 className="section-title">Lifestyle</h3>
              <div className="form-group">
                <label>Smoking:</label>
                <select name="smoking" value={formData.smoking} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="Former Smoker">Former Smoker</option>
                </select>
              </div>
              <div className="form-group">
                <label>Alcohol Use:</label>
                <select name="alcohol" value={formData.alcohol} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="Occasionally">Occasionally</option>
                </select>
              </div>
            </div>
                
             {/* Vision & Hearing */}
             <div>
              <h3 className="section-title">Vision & Hearing</h3>
              <div className="form-group">
                <label>Hearing:</label>
                <div className="grid grid-cols-2 gap-2">
                  <select name="hearing_right" value={formData.hearing_right} onChange={handleChange}>
                    <option value="">Right</option>
                    <option value="Normal">Normal</option>
                    <option value="Impaired">Impaired</option>
                    <option value="Deaf">Deaf</option>
                  </select>
                  <select name="hearing_left" value={formData.hearing_left} onChange={handleChange}>
                    <option value="">Left</option>
                    <option value="Normal">Normal</option>
                    <option value="Impaired">Impaired</option>
                    <option value="Deaf">Deaf</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Eyesight:</label>
                <div className="grid grid-cols-2 gap-2">
                  <select name="eyesight_right" value={formData.eyesight_right} onChange={handleChange}>
                    <option value="">Right</option>
                    <option value="Normal">Normal</option>
                    <option value="Impaired">Impaired</option>
                    <option value="Blind">Blind</option>
                  </select>
                  <select name="eyesight_left" value={formData.eyesight_left} onChange={handleChange}>
                    <option value="">Left</option>
                    <option value="Normal">Normal</option>
                    <option value="Impaired">Impaired</option>
                    <option value="Blind">Blind</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Eyesight (with visual aids):</label>
                <div className="grid grid-cols-2 gap-2">
                  <select name="visual_aid_right" value={formData.visual_aid_right} onChange={handleChange}>
                    <option value="">Right</option>
                    <option value="Normal">Normal</option>
                    <option value="Impaired">Impaired</option>
                    <option value="Blind">Blind</option>
                  </select>
                  <select name="visual_aid_left" value={formData.visual_aid_left} onChange={handleChange}>
                    <option value="">Left</option>
                    <option value="Normal">Normal</option>
                    <option value="Impaired">Impaired</option>
                    <option value="Blind">Blind</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Color Vision:</label>
                <input
                  type="text"
                  name="color_vision"
                  value={formData.color_vision}
                  onChange={handleChange}
                  placeholder="e.g., Normal"
                />
              </div>
            </div>
            </div>
          

          <div className="grid grid-cols-2 gap-4 mt-6">
            {/* Lab & Diagnostic Results */}
            <div>
              <h3 className="section-title">Lab & Diagnostic Results</h3>
              <div className="form-group">
                <label>Urinalysis (Protein/Albumin):</label>
                <input
                  type="text"
                  name="urinalysis"
                  value={formData.urinalysis}
                  onChange={handleChange}
                  placeholder="e.g., Negative"
                />
              </div>

              <div className="form-group">
                <label>ECG:</label>
                <select name="ecg" value={formData.ecg} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Normal">Normal</option>
                  <option value="Abnormal">Abnormal</option>
                </select>
              </div>

              <div className="form-group">
                <label>Chest X-Ray:</label>
                <select name="xray" value={formData.xray} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Normal">Normal</option>
                  <option value="Abnormal">Abnormal</option>
                </select>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <div className="grid grid-cols-2 gap-4">
                <h3 className="section-title">Emergency Contact</h3>
                <div className="form-group">
                  <label>Emergency Contact Name:</label>
                  <input
                    type="text"
                    name="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={handleChange}
                    placeholder="e.g., Full Name as per IC"
                  />
                </div>

                <div className="form-group">
                  <label>Emergency Contact Number:</label>
                  <input
                    type="text"
                    name="emergency_contact_number"
                    value={formData.emergency_contact_number}
                    onChange={handleChange}
                    placeholder="e.g., 0123456789"
                  />
                </div>

                <div className="form-group">
                  <label>Relationship:</label>
                  <input
                    type="text"
                    name="relation_to_patient"
                    value={formData.relation_to_patient}
                    onChange={handleChange}
                    placeholder="e.g., Spouse"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <h3 className="section-title">Upload Medical File</h3>

            <div>
              <label>Upload File:</label>
              <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
            </div>

            {/* Submit Button */}
            <div className="section mt-6">
              <button type="submit">Submit</button>
            </div>
          </div>
        </form>
      </div>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {
        submittedDetails && (
          <div className="submitted-details">
            <h3>Submitted Patient Details:</h3>
            <p>IC Number: {submittedDetails.ic}</p>
            <p>Full Name: {submittedDetails.fullName}</p>
            <p>Age: {submittedDetails.age}</p>
            <p>Gender: {submittedDetails.gender}</p>
            <p>File Uploaded: {submittedDetails.file_name}</p>
            <h4>Medical Details:</h4>
            {Object.entries(formData).map(([key, value]) => (
              <p key={key}>{key.replace(/([A-Z])/g, " $1")}: {value}</p>
            ))}
          </div>
        )
      }
    </div >
  );
};

export default PatientRecords;
