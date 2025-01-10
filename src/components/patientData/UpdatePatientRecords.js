import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdatePatientRecords = () => {
  const [patientId, setPatientId] = useState('');
  const [patient, setPatient] = useState(null);
  const [updatedRecord, setUpdatedRecord] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch patient details by IC number (or patient ID)
  useEffect(() => {
    if (patientId) {
      axios.get(`/api/patient/${patientId}`)
        .then((response) => {
          setPatient(response.data);
        })
        .catch((error) => {
          setErrorMessage('Patient not found');
        });
    }
  }, [patientId]);

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/update-patient-records/${patientId}`, { updatedRecord });
      setSuccessMessage('Patient record updated successfully');
    } catch (error) {
      setErrorMessage('Failed to update record');
    }
  };

  return (
    <div className="update-patient-records">
      <h2>Update Patient Records</h2>
      <input
        type="text"
        placeholder="Enter Patient ID or IC Number"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
      />
      {patient && (
        <>
          <h3>{patient.full_name}'s Records</h3>
          <textarea
            placeholder="Update patient's medical records..."
            value={updatedRecord}
            onChange={(e) => setUpdatedRecord(e.target.value)}
          />
          <button onClick={handleUpdate}>Update Record</button>
        </>
      )}
      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default UpdatePatientRecords;
