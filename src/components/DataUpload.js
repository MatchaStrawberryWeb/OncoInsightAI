import React, { useState } from 'react';
import './DataUpload.css';

const DataUpload = () => {
    const [imageFile, setImageFile] = useState(null);
    const [patientData, setPatientData] = useState({
        age: '',
        gender: '',
        symptoms: '',
    });
    const [predictionResult, setPredictionResult] = useState(null);
    const [confidence, setConfidence] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    // Handle image file upload
    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    // Handle patient data input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPatientData({
            ...patientData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile || !patientData.age || !patientData.gender) {
            setErrorMessage('Please fill in all fields and upload an image.');
            return;
        }

        // FormData to send the file and patient data
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('age', patientData.age);
        formData.append('gender', patientData.gender);
        formData.append('symptoms', patientData.symptoms);

        try {
            // Sending the data to the FastAPI backend
            const response = await fetch('http://localhost:8000/predict', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Prediction failed');
            }

            const data = await response.json();
            setPredictionResult(data.prediction);
            setConfidence(data.confidence);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Error uploading data. Please try again.');
            console.error(error);
        }
    };

    return (
        <div className="data-upload-container">
            <h1>Data Upload & Prediction</h1>
            <form onSubmit={handleSubmit} className="upload-form">
                <div className="input-group">
                    <label htmlFor="image-upload">Upload Medical Image:</label>
                    <input
                        type="file"
                        id="image-upload"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="age">Age:</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={patientData.age}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="gender">Gender:</label>
                    <select
                        id="gender"
                        name="gender"
                        value={patientData.gender}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                <div className="input-group">
                    <label htmlFor="symptoms">Symptoms (Optional):</label>
                    <textarea
                        id="symptoms"
                        name="symptoms"
                        value={patientData.symptoms}
                        onChange={handleInputChange}
                        placeholder="Enter symptoms here"
                    />
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <button type="submit" className="predict-button">
                    Predict
                </button>
            </form>

            {predictionResult && (
                <div className="prediction-result">
                    <h2>Prediction Result</h2>
                    <p>Prediction: {predictionResult}</p>
                    <p>Confidence: {confidence}%</p>
                </div>
            )}
        </div>
    );
};

export default DataUpload;
