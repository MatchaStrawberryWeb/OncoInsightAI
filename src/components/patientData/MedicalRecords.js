import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/MedicalRecords.css';
import Sidebar from '../Sidebar';

const MedicalRecords = () => {
  const [editingPatient, setEditingPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [medicalHistory, setMedicalHistory] = useState([]);

  const [formData, setFormData] = useState({
    ic: '',
    fullName: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    bloodType: '',
    smoking: '',
    alcohol: '',
    diabetes: '',
    high_blood_pressure: '',
    heart_disease: '',
    asthma: '',
    medications: '',
    allergies: '',
    surgeries: '',
    family_history: '',
    eyesight_right: '',
    eyesight_left: '',
    visual_aid_right: '',
    visual_aid_left: '',
    hearing_right: '',
    hearing_left: '',
    color_vision: '',
    urinalysis: '',
    ecg: '',
    xray: '',
    contact_name: '',
    contact_number: '',
    relation_to_patient: '',
    medical_file: ''
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/patients');
      setPatients(response.data);
    } catch (error) {
      setErrorMessage('Failed to load patients.');
    }
  };

  const fetchMedicalHistory = async (ic) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/patients/${ic}/medical_history`);
      setMedicalHistory(response.data);
    } catch (error) {
      console.error('Failed to load medical history', error);
      setMedicalHistory([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormData({ ...patient });
    setSuccessMessage('');
    setErrorMessage('');
    setSelectedFile(null);
    fetchMedicalHistory(patient.ic);
  };

  const handleSave = async () => {
    try {
      const form = new FormData();
      for (const key in formData) {
        form.append(key, formData[key]);
      }
      if (selectedFile) {
        form.append("medical_file", selectedFile);
      }

      const response = await axios.put(
        `http://127.0.0.1:8000/api/patients/${formData.ic}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Success:", response.data); // ✅ log the response

      setSuccessMessage("Patient data updated successfully.");
      setErrorMessage("");
      setTimeout(() => {
        setEditingPatient(null);
        fetchPatients();
      }, 1500);
    } catch (error) {
      console.error("Error saving:", error);
      setErrorMessage("Failed to update patient data.");
      setSuccessMessage("");
    }
  };

  const handleDelete = async (ic) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/patients/${ic}`);
      setSuccessMessage('Patient data deleted successfully.');
      fetchPatients();
      if (editingPatient && editingPatient.ic === ic) {
        setEditingPatient(null);
        setMedicalHistory([]);
      }
    } catch (error) {
      setErrorMessage('Failed to delete patient data.');
    }
  };

  return (
    <div className="container">
      <Sidebar />
      <div className="main-content">
        <h2>Medical Records Management</h2>

        <input
          type="text"
          placeholder="Search by IC or Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />

        <table>
          <thead>
            <tr>
              <th>IC</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients
              .filter(
                (p) =>
                  p.ic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.fullName.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((p) => (
                <tr key={p.ic}>
                  <td>{p.ic}</td>
                  <td>{p.fullName}</td>
                  <td>{p.age}</td>
                  <td>{p.gender}</td>
                  <td>
                    <button onClick={() => handleEdit(p)}>Edit</button>{' '}
                    <button onClick={() => handleDelete(p.ic)}>Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Messages at the top */}
        {successMessage && <p className="success">{successMessage}</p>}
        {errorMessage && <p className="error">{errorMessage}</p>}

        {editingPatient && (
          <div className="edit-form">
            <h3>Edit Patient: {formData.fullName}</h3>
            <form className="medical-form" onSubmit={(e) => e.preventDefault()}>
              {/* Basic Info */}
              <section>
                <h4>Basic Info</h4>
                <div className="form-grid">
                  {/* (Same fields as before for basic info, smoking, alcohol, etc.) */}
                  {/* ... */}
                  <div className="form-group">
                    <label>IC Number</label>
                    <input type="text" name="ic" value={formData.ic} onChange={handleChange} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Age</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <input type="text" name="gender" value={formData.gender} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Height</label>
                    <input type="text" name="height" value={formData.height} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Weight</label>
                    <input type="text" name="weight" value={formData.weight} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Blood Type</label>
                    <input type="text" name="bloodType" value={formData.bloodType} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Smoking</label>
                    <select name="smoking" value={formData.smoking} onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                      <option value="Former Smoker">Former Smoker</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Alcohol Use</label>
                    <select name="alcohol" value={formData.alcohol} onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                      <option value="Occasionally">Occasionally</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Medical Conditions */}
              <section>
                <h4>Medical Conditions</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Diabetes</label>
                    <input type="text" name="diabetes" value={formData.diabetes} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>High Blood Pressure</label>
                    <input type="text" name="high_blood_pressure" value={formData.high_blood_pressure} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Heart Disease</label>
                    <input type="text" name="heart_disease" value={formData.heart_disease} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Asthma</label>
                    <input type="text" name="asthma" value={formData.asthma} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Medications</label>
                    <input type="text" name="medications" value={formData.medications} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Allergies</label>
                    <input type="text" name="allergies" value={formData.allergies} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Surgeries</label>
                    <input type="text" name="surgeries" value={formData.surgeries} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Family History</label>
                    <input type="text" name="family_history" value={formData.family_history} onChange={handleChange} />
                  </div>
                </div>
              </section>

              {/* Vision & Hearing */}
              <section>
                <h4>Vision & Hearing</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Eyesight Right</label>
                    <select name="eyesight_right" value={formData.eyesight_right} onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="Normal">Normal</option>
                      <option value="Impaired">Impaired</option>
                      <option value="Blind">Blind</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Eyesight Left</label>
                    <select name="eyesight_left" value={formData.eyesight_left} onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="Normal">Normal</option>
                      <option value="Impaired">Impaired</option>
                      <option value="Blind">Blind</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Visual Aid Right</label>
                    <select name="visual_aid_right" value={formData.visual_aid_right} onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="Normal">Normal</option>
                      <option value="Impaired">Impaired</option>
                      <option value="Blind">Blind</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Visual Aid Left</label>
                    <select name="visual_aid_left" value={formData.visual_aid_left} onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="Normal">Normal</option>
                      <option value="Impaired">Impaired</option>
                      <option value="Blind">Blind</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Hearing Right</label>
                    <select name="hearing_right" value={formData.hearing_right} onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="Normal">Normal</option>
                      <option value="Impaired">Impaired</option>
                      <option value="Deaf">Deaf</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Hearing Left</label>
                    <select name="hearing_left" value={formData.hearing_left} onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="Normal">Normal</option>
                      <option value="Impaired">Impaired</option>
                      <option value="Deaf">Deaf</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Color Vision</label>
                    <select name="color_vision" value={formData.color_vision} onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="Normal">Normal</option>
                      <option value="Color Blind">Color Blind</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Other Tests */}
              <section>
                <h4>Other Test Results</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Urinalysis</label>
                    <input type="text" name="urinalysis" value={formData.urinalysis} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>ECG</label>
                    <input type="text" name="ecg" value={formData.ecg} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Chest X-ray</label>
                    <input type="text" name="xray" value={formData.xray} onChange={handleChange} />
                  </div>
                </div>
              </section>

              {/* Emergency Contact */}
              <section>
                <h4>Emergency Contact</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Contact Name</label>
                    <input type="text" name="contact_name" value={formData.contact_name} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Contact Number</label>
                    <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Relation to Patient</label>
                    <input type="text" name="relation_to_patient" value={formData.relation_to_patient} onChange={handleChange} />
                  </div>
                </div>
              </section>

              {/* File Upload */}
              <section>
                <div className="form-group">
                  <label>Upload Medical File</label>
                  <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                </div>
              </section>

              {/* Medical History (Read-only) */}
              <section>
                <h4>Medical History</h4>
                {medicalHistory.length > 0 ? (
                  <ul className="medical-history-list">
                    {medicalHistory.map((item, index) => (
                      <li key={index} className="medical-history-item">
                        <p><strong>Diagnosis:</strong> {item.diagnosis}</p>
                        <p><strong>Medications:</strong> {item.medications}</p>
                        <p><strong>Allergies:</strong> {item.allergies}</p>
                        <p><strong>Surgeries:</strong> {item.surgeries}</p>
                        <p><strong>Family History:</strong> {item.family_history || item.familyHistory}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No medical history records found.</p>
                )}
              </section>

              {/* Buttons */}
              <div className="form-buttons">
                <button type="button" onClick={handleSave}>
                  Save
                </button>
                <button type="button" onClick={() => setEditingPatient(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;
