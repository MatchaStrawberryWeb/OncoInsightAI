import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/MedicalRecords.css';
import Sidebar from '../Sidebar'; // Import Sidebar component

const MedicalRecords = () => {
  const [patients, setPatients] = useState([]); // Store the list of patients
  const [filteredPatients, setFilteredPatients] = useState([]); // Store filtered patients for search
  const [searchQuery, setSearchQuery] = useState(''); // Store the search query
  const [icNumber, setIcNumber] = useState(''); // Store the IC number of the selected patient
  const [updatedRecord, setUpdatedRecord] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [updatedFile, setUpdatedFile] = useState(null); // For storing the uploaded file

  // Fetch patients list from the server
  const fetchPatients = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/patients");
      if (response.ok) {
        const data = await response.json();
        setPatients(data); // Store the list of patients in the state
        setFilteredPatients(data); // Initialize filtered patients with all patients
      } else {
        setErrorMessage("Failed to load patients.");
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
      setErrorMessage("Failed to load patients.");
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []); // Fetch patients when component mounts

  // Filter patients based on search query
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = patients.filter(patient =>
      patient.ic_number.toLowerCase().includes(lowercasedQuery) ||
      patient.full_name.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredPatients(filtered);
  }, [searchQuery, patients]);

  // Handle the update of the patient record
  const handleUpdate = async () => {
    if (!icNumber || (!updatedFile && !updatedRecord)) {
      setErrorMessage("Please select a patient and provide data to update.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file_name", updatedFile); // Attach the file
      formData.append("medical_record", updatedRecord); // Attach the updated medical record

      // Update the patient record using the PUT request
      await axios.put(
        `http://127.0.0.1:8000/medical-records/${icNumber}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Required for file upload
          },
        }
      );

      // Update the state with the updated patient data immediately
      const updatedPatients = patients.map(patient =>
        patient.ic_number === icNumber
          ? { ...patient, medical_record: updatedRecord, file: updatedFile ? updatedFile.name : patient.file }
          : patient
      );
      setPatients(updatedPatients); // Update the patients state with the new data
      setFilteredPatients(updatedPatients); // Update the filtered list

      setSuccessMessage("Patient record updated successfully!");
      setErrorMessage("");
    } catch (error) {
      console.error("Error updating record:", error);
      setErrorMessage("Failed to update record");
    }
  };

  return (
    <div className="container">
      {/* Use Sidebar component */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">
        <h2>Patient Medical Records</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by IC Number or Full Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />

        {/* Table of Patients */}
        <h3>Registered Patients</h3>
        <table>
          <thead>
            <tr>
              <th>IC Number</th>
              <th>Full Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Medical History</th>
              <th>File</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.ic_number}>
                <td>{patient.ic_number}</td>
                <td>{patient.full_name}</td>
                <td>{patient.age}</td>
                <td>{patient.gender}</td>
                <td>{patient.medical_record || "No history available"}</td>
                <td>
                  {patient.file ? (
                    <a href={`/uploads/${patient.file}`} target="_blank" rel="noopener noreferrer">
                      View File
                    </a>
                  ) : (
                    "No file uploaded"
                  )}
                </td>
                <td>
                  <button onClick={() => setIcNumber(patient.ic_number)}>
                    Update Record
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Patient Details for Update */}
        {icNumber && (
          <>
            <h3>Update Record for IC Number: {icNumber}</h3>

            <textarea
              placeholder="Update patient's medical records..."
              value={updatedRecord}
              onChange={(e) => setUpdatedRecord(e.target.value)}
            />

            <input
              type="file"
              onChange={(e) => setUpdatedFile(e.target.files[0])}
            />

            <button onClick={handleUpdate}>Update Record</button>
          </>
        )}

        {/* Success/Failure Messages */}
        {successMessage && <p className="success">{successMessage}</p>}
        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default MedicalRecords;
