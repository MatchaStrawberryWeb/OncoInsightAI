import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewPatientHistory = () => {
  const [patientId, setPatientId] = useState('');
  const [patientHistory, setPatientHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch patient history when a patient ID is provided
  useEffect(() => {
    if (patientId) {
      axios.get(`/api/patient-history/${patientId}`)
        .then((response) => {
          setPatientHistory(response.data.history);
        })
        .catch((error) => {
          setErrorMessage('Failed to load patient history');
        });
    }
  }, [patientId]);

  return (
    <div className="view-patient-history">
      <h2>View Patient History</h2>
      <input
        type="text"
        placeholder="Enter Patient ID or IC Number"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
      />
      {patientHistory.length > 0 ? (
        <ul>
          {patientHistory.map((record, index) => (
            <li key={index}>
              <strong>{record.date}</strong> - {record.details}
            </li>
          ))}
        </ul>
      ) : (
        <p>No history available for this patient.</p>
      )}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default ViewPatientHistory;
