import React, { useState } from 'react';

const PredictForm = () => {
    const [formData, setFormData] = useState({
        Clump_Thickness: '',
        Uniformity_of_Cell_Size: '',
        Uniformity_of_Cell_Shape: '',
        Marginal_Adhesion: '',
        Single_Epithelial_Cell_Size: '',
        Bare_Nuclei: '',
        Bland_Chromatin: '',
        Normal_Nucleoli: '',
        Mitoses: ''
    });

    const [prediction, setPrediction] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const modelName = "breast_cancer"; // You can make this dynamic based on user selection

        try {
            const response = await fetch(`http://127.0.0.1:8000/predict/${modelName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            setPrediction(result.prediction);
        } catch (error) {
            console.error('Error making prediction:', error);
        }
    };

    return (
        <div>
            <h2>Predict Breast Cancer</h2>
            <form onSubmit={handleSubmit}>
                {/* Render input fields for each feature */}
                {Object.keys(formData).map((key) => (
                    <div key={key}>
                        <label>{key.replace(/_/g, ' ')}</label>
                        <input
                            type="number"
                            name={key}
                            value={formData[key]}
                            onChange={handleChange}
                        />
                    </div>
                ))}
                <button type="submit">Submit</button>
            </form>

            {prediction !== null && (
                <div>
                    <h3>Prediction: {prediction === 2 ? 'Benign' : 'Malignant'}</h3>
                </div>
            )}
        </div>
    );
};

export default PredictForm;
