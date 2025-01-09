import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar'; 
import '../css/CancerDiagnosis.css';

const CancerDiagnosis = () => {
    const [icNumber, setIcNumber] = useState('');
    const [patientDetails, setPatientDetails] = useState(null);
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('ic_number', icNumber);

        try {
            const response = await axios.post('/diagnose', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResult(response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const checkPatient = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/patient/${icNumber}`); 
            setPatientDetails(response.data);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                alert("Patient not found");
            } else {
                console.error("Error fetching patient details:", error);
            }
        }
    };
    

    return (
        <div className="diagnosis-container">
            <Sidebar /> {/* Add Sidebar to the page */}
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
                            Check
                        </button>
                    </div>
                    {patientDetails && (
                        <div className="patient-details">
                            <h3>Patient Details</h3>
                            <p><strong>Name:</strong> {patientDetails.full_name}</p>
                            <p><strong>Age:</strong> {patientDetails.age}</p>
                            <p><strong>Gender:</strong> {patientDetails.gender}</p>
                        </div>
                    )}
                    {patientDetails && (
                        <div>
                            <div className="form-group">
                                <label>Upload Scan:</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    required
                                />
                            </div>
                            <button type="submit" className="submit-button">Submit</button>
                        </div>
                    )}
                </form>
                {result && (
                    <div className="result">
                        <h2>Diagnosis Results</h2>
                        <pre>{JSON.stringify(result, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CancerDiagnosis;