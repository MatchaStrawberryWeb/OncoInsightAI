import React, { useState } from 'react';
import '../css/CancerDiagnosis.css';
import Sidebar from './Sidebar';

const CancerDiagnosis = () => {
  const [selectedCancer, setSelectedCancer] = useState('');
  const [formData, setFormData] = useState({});
  const [icData, setIcData] = useState({});
  const [ic, setIc] = useState('');

  const handleIcSearch = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/patient/${ic}`);
      const data = await response.json();
      setIcData(data);
    } catch (error) {
      console.error("Failed to fetch patient data:", error);
    }
  };


  const handleCancerChange = (e) => {
    setSelectedCancer(e.target.value);
    setFormData({});
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpointMap = {
      'Breast Cancer': '/predict_breast',
      'Lung Cancer': '/predict_lung',
      'Prostate Cancer': '/predict_prostate',
      'Colorectal Cancer': '/predict_colorectal'
    };

    try {
      const response = await fetch(`http://localhost:8000${endpointMap[selectedCancer]}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      console.log('Prediction result:', result);
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

          {icData && icData.fullName && (
            <div className="patient-info">
              <p><strong>IC:</strong> {icData.ic}</p>
              <p><strong>Name:</strong> {icData.fullName}</p>
              <p><strong>Age:</strong> {icData.age}</p>
              <p><strong>Gender:</strong> {icData.gender}</p>
              <p><strong>Height:</strong> {icData.height} cm</p>
              <p><strong>Weight:</strong> {icData.weight} kg</p>
              <p><strong>Blood Type:</strong> {icData.bloodType}</p>
              <p><strong>Smoking:</strong> {icData.smoking}</p>
              <p><strong>Alcohol:</strong> {icData.alcohol}</p>
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
          {selectedCancer && <button type="submit" className="submit-button">Diagnose</button>}
        </form>
      </div>
    </div>
  );
};

export default CancerDiagnosis;