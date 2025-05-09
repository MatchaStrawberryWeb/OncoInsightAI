import React, { useState } from 'react';
import '../css/CancerDiagnosis.css';
import Sidebar from './Sidebar';
import CancerResultChart from './CancerResultChart';


const CancerDiagnosis = () => {
  const [selectedCancer, setSelectedCancer] = useState('');
  const [formData, setFormData] = useState({});
  const [icData, setIcData] = useState({});
  const [ic, setIc] = useState('');


  const handleIcSearch = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/patients/${ic}/full_details/`);
      const data = await response.json();
      setIcData(data);
    } catch (error) {
      console.error("Failed to fetch full patient data:", error);
    }
  };


  const handleCancerChange = (e) => {
    setSelectedCancer(e.target.value);
    setFormData({});
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
  };

  const [predictionResult, setPredictionResult] = useState(null);


  const renderCancerForm = () => {
    const commonProps = {
      onChange: handleInputChange,
      type: 'number',
      className: 'form-input'
    };

    if (selectedCancer === 'Breast Cancer') {
      return (
        <>
          <div>
            <label>Radius Mean</label>
            <input
              name="radius_mean"
              placeholder="e.g. 14.32"
              step="0.01"
              {...commonProps}
            />
          </div>
          <div>
            <label>Texture Mean</label>
            <input
              name="texture_mean"
              placeholder="e.g. 19.85"
              step="0.01"
              {...commonProps}
            />
          </div>
          <div>
            <label>Perimeter Mean</label>
            <input
              name="perimeter_mean"
              placeholder="e.g. 88.20"
              step="0.01"
              {...commonProps}
            />
          </div>
          <div>
            <label>Area Mean</label>
            <input
              name="area_mean"
              placeholder="e.g. 500.30"
              step="0.01"
              {...commonProps}
            />
          </div>
          <div>
            <label>Smoothness Mean</label>
            <input
              name="smoothness_mean"
              placeholder="e.g. 0.10"
              step="0.01"
              {...commonProps}
            />
          </div>
        </>
      );
    }
    else if (selectedCancer === 'Prostate Cancer') {
      return (
        <>
          <div>
            <label>Radius</label>
            <input name="radius" type="number" step="0.01" placeholder="e.g. 14.32" {...commonProps} />
          </div>
          <div>
            <label>Texture</label>
            <input name="texture" type="number" step="0.01" placeholder="e.g. 19.85" {...commonProps} />
          </div>
          <div>
            <label>Perimeter</label>
            <input name="perimeter" type="number" step="0.01" placeholder="e.g. 88.20" {...commonProps} />
          </div>
          <div>
            <label>Area</label>
            <input name="area" type="number" step="0.01" placeholder="e.g. 500.30" {...commonProps} />
          </div>
          <div>
            <label>Smoothness</label>
            <input name="smoothness" type="number" step="0.01" placeholder="e.g. 0.10" {...commonProps} />
          </div>
          <div>
            <label>Compactness</label>
            <input name="compactness" type="number" step="0.01" placeholder="e.g. 0.75" {...commonProps} />
          </div>
          <div>
            <label>Symmetry</label>
            <input name="symmetry" type="number" step="0.01" placeholder="e.g. 0.42" {...commonProps} />
          </div>
          <div>
            <label>Fractal Dimension</label>
            <input name="fractal_dimension" type="number" step="0.01" placeholder="e.g. 0.06" {...commonProps} />
          </div>
        </>
      );

    } else if (selectedCancer === 'Colorectal Cancer') {
      return (
        <>
          {[...Array(10)].map((_, i) => (
            <div key={i}>
              <label>{`Selected Gene Feature ${i + 1}`}</label>
              <input
                name={`gene_feature_${i + 1}`}
                placeholder={`e.g. 0.${i + 1}2`}
                step="0.01"
                {...commonProps}
              />
            </div>
          ))}
        </>
      );

    } else if (selectedCancer === 'Lung Cancer') {
      const lungFields = [
        "SMOKING", "YELLOW_FINGERS", "ANXIETY", "PEER_PRESSURE", "CHRONIC_DISEASE",
        "FATIGUE", "ALLERGY", "WHEEZING", "ALCOHOL_CONSUMING", "COUGHING",
        "SHORTNESS_OF_BREATH", "SWALLOWING_DIFFICULTY", "CHEST_PAIN"
      ];

      return (
        <>
          {lungFields.map((field) => (
            <div key={field} className="form-group">
              <label>{field.replace(/_/g, ' ')}</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name={field}
                    value={1}
                    onChange={handleInputChange}
                  /> Yes
                </label>
                <label style={{ marginLeft: '15px' }}>
                  <input
                    type="radio"
                    name={field}
                    value={0}
                    onChange={handleInputChange}
                  /> No
                </label>
              </div>
            </div>
          ))}
        </>
      );
    }
  };

  const endpointMap = {
    'Breast Cancer': '/predict_breast',
    'Lung Cancer': '/predict_lung',
    'Prostate Cancer': '/predict_prostate',
    'Colorectal Cancer': '/predict_colorectal',
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000${endpointMap[selectedCancer]}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      console.log('Prediction result:', result);
      setPredictionResult(result);
    } catch (error) {
      console.error('Prediction failed:', error);
    }
  };


  return (
    <div className="cancer-diagnosis-page">
      <Sidebar />
      <div className="cancer-diagnosis-content">
        <h2>Cancer Diagnosis</h2>

        <div className="form-section">
          <label>IC Number:</label>
          <input
            type="text"
            value={ic}
            onChange={(e) => setIc(e.target.value)}
            className="form-input"
          />
          <button onClick={handleIcSearch} className="search-button">Search</button>

          {icData && icData.patient_records && (
            <div>
              <h2>Patient Record</h2>
              <p><strong>IC:</strong> {icData.patient_records.ic}</p>
              <p><strong>Name:</strong> {icData.patient_records.fullName}</p>
              <p><strong>Age:</strong> {icData.patient_records.age}</p>
              <p><strong>Gender:</strong> {icData.patient_records.gender}</p>
              <p><strong>Height:</strong> {icData.patient_records.height} cm</p>
              <p><strong>Weight:</strong> {icData.patient_records.weight} kg</p>
              <p><strong>Blood Type:</strong> {icData.patient_records.bloodType}</p>
              <p><strong>Smoking:</strong> {icData.patient_records.smoking}</p>
              <p><strong>Alcohol:</strong> {icData.patient_records.alcohol}</p>

              <h2>Medical History</h2>
              {icData.medical_history.length === 0 ? (
                <p>No medical history found.</p>
              ) : (
                icData.medical_history.map((record, index) => (
                  <div key={index} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
                    <p><strong>Date:</strong> {record.date_recorded}</p>
                    <p><strong>Diabetes:</strong> {record.diabetes}</p>
                    <p><strong>High Blood Pressure:</strong> {record.high_blood_pressure}</p>
                    <p><strong>Heart Disease:</strong> {record.heart_disease}</p>
                    <p><strong>Asthma:</strong> {record.asthma}</p>
                    <p><strong>Medications:</strong> {record.medications}</p>
                    <p><strong>Allergies:</strong> {record.allergies}</p>
                    <p><strong>Surgeries:</strong> {record.surgeries}</p>
                    <p><strong>Family History:</strong> {record.family_history}</p>
                    <p><strong>Eyesight (Right/Left):</strong> {record.eyesight_right} / {record.eyesight_left}</p>
                    <p><strong>Visual Aid (Right/Left):</strong> {record.visual_aid_right} / {record.visual_aid_left}</p>
                    <p><strong>Hearing (Right/Left):</strong> {record.hearing_right} / {record.hearing_left}</p>
                    <p><strong>Color Vision:</strong> {record.color_vision}</p>
                    <p><strong>Urinalysis:</strong> {record.urinalysis}</p>
                    <p><strong>ECG:</strong> {record.ecg}</p>
                    <p><strong>X-Ray:</strong> {record.xray}</p>
                  </div>
                ))
              )}
            </div>
          )}
          {icData && icData.message && (
            <p className="not-found-message">{icData.message}</p>
          )}
        </div>

        <div className="form-section">
          <label>Select Cancer Type:</label>
          <select value={selectedCancer} onChange={handleCancerChange} className="form-select">
            <option value="">-- Select Cancer --</option>
            <option value="Breast Cancer">Breast Cancer</option>
            <option value="Lung Cancer">Lung Cancer</option>
            <option value="Prostate Cancer">Prostate Cancer</option>
            <option value="Colorectal Cancer">Colorectal Cancer</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} className="dynamic-form">
          {renderCancerForm()}

          <div className="form-section">
            <label>Upload Report / Scan Files:</label>
            <input
              type="file"
              multiple
              onChange={(e) => console.log("Files uploaded:", e.target.files)}
              className="form-input"
            />
            <small>You can upload multiple files (PDF, JPG, PNG, etc.).</small>
          </div>
          {selectedCancer && <button type="submit" className="submit-button">Diagnose</button>}

        </form>

        {predictionResult && (
          <>
            <h3>Diagnosis Result</h3>
            <p><strong>Cancer Type:</strong> {predictionResult.cancerType}</p>
            <p><strong>Cancer Stage:</strong> {predictionResult.cancerStage || "None"}</p>

            {predictionResult.probability && (
              <CancerResultChart probability={predictionResult.probability} />
            )}

          </>
        )}
      </div>
    </div>
  );
};

export default CancerDiagnosis;