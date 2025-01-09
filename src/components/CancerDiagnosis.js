import React, { useState } from 'react';
import axios from 'axios';

const CancerDiagnosis = () => {
    const [icNumber, setIcNumber] = useState('');
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

    return (
        <div>
            <h1>Cancer Diagnosis</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>IC Number:</label>
                    <input
                        type="text"
                        value={icNumber}
                        onChange={(e) => setIcNumber(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Upload Scan:</label>
                    <input type="file" onChange={handleFileChange} required />
                </div>
                <button type="submit">Submit</button>
            </form>
            {result && (
                <div>
                    <h2>Diagnosis Results</h2>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default CancerDiagnosis;