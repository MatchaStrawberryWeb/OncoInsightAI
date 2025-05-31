import React, { useState, useEffect, useRef } from 'react';
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';
import '../css/CancerDiagnosis.css';
import Sidebar from './Sidebar';
import CancerResultChart from './CancerResultChart';
import SurvivalPredictionChart from './SurvivalPredictionChart';

const CancerDiagnosis = () => {
  const [selectedCancer, setSelectedCancer] = useState('');
  const [formData, setFormData] = useState({
    GENDER: '',
    AGE: '',
    SMOKING: '',
    ALCOHOL_CONSUMING: '',
    YELLOW_FINGERS: '',
    ANXIETY: '',
    PEER_PRESSURE: '',
    CHRONIC_DISEASE: '',
    FATIGUE: '',
    ALLERGY: '',
    WHEEZING: '',
    COUGHING: '',
    SHORTNESS_OF_BREATH: '',
    SWALLOWING_DIFFICULTY: '',
    CHEST_PAIN: '',
  });


  const [uploadedScans, setUploadedScans] = useState([]);

  const [icData, setIcData] = useState({});
  const [ic, setIc] = useState('');
  const [fullName, setFullName] = useState('');
  const [survivalPredictionResult, setSurvivalPredictionResult] = React.useState(null);
  const [treatmentPlan, setTreatmentPlan] = useState([]);

  useEffect(() => {
    if (icData && icData.patient_records && icData.patient_records.fullName) {
      setFullName(icData.patient_records.fullName);
    }
  }, [icData]);


  const handleIcSearch = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/patients/${ic}/full_details/`);
      const data = await response.json();
      console.log("Full patient data:", data);
      setIcData(data);
      setFullName(data.full_name || '');
    } catch (error) {
      console.error("Failed to fetch full patient data:", error);
    }
  };

  const handleCancerChange = (e) => {
    setSelectedCancer(e.target.value);
    setFormData({});
  };

  const handleInputChange = (e) => {
    if (e.target.type === 'file' && e.target.name === 'skin_image') {

      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {

      setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
    }
  };

  const handleImageUpload = (e) => {
    setFormData({ ...formData, skin_image: e.target.files[0] });
  };


  const [predictionResult, setPredictionResult] = useState(null);

  const pieRef = useRef(null);
  const barRef = useRef(null);

  const [doctorNote, setDoctorNote] = useState('');
  const [doctorSignature, setDoctorSignature] = useState('');

  useEffect(() => {
    const doctorName = sessionStorage.getItem("doctorName") || "Dr. Badrul Bin Mahmod";
    setDoctorSignature(doctorName);
  }, []);


  const lungFields = [
    "GENDER", "AGE", "SMOKING", "ALCOHOL_CONSUMING", "YELLOW_FINGERS", "ANXIETY", "PEER_PRESSURE",
    "CHRONIC_DISEASE", "FATIGUE", "ALLERGY", "WHEEZING", "COUGHING",
    "SHORTNESS_OF_BREATH", "SWALLOWING_DIFFICULTY", "CHEST_PAIN"
  ];

  // Function to format labels nicely
  const formatLabel = (field) => {
    return field
      .toLowerCase()
      .split('_')
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' ');
  };


  const selectedGenes = [
    "1431_at",
    "1552399_a_at",
    "1552794_a_at",
    "1553162_x_at",
    "1553423_a_at",
    "1553505_at",
    "1553971_a_at",
    "1554225_a_at",
    "1554554_at",
    "1554610_at",
  ];

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
            <label>Radius Mean (Pixels)</label>
            <input
              name="radius_mean"
              placeholder="e.g. 14.32"
              step="0.01"
              {...commonProps}
            />
          </div>
          <div>
            <label>Texture Mean (Pixels)</label>
            <input
              name="texture_mean"
              placeholder="e.g. 19.85"
              step="0.01"
              {...commonProps}
            />
          </div>
          <div>
            <label>Perimeter Mean (Pixels)</label>
            <input
              name="perimeter_mean"
              placeholder="e.g. 88.20"
              step="0.01"
              {...commonProps}
            />
          </div>
          <div>
            <label>Area Mean (Pixels)</label>
            <input
              name="area_mean"
              placeholder="e.g. 500.30"
              step="0.01"
              {...commonProps}
            />
          </div>
          <div>
            <label>Smoothness Mean (Pixels)</label>
            <input
              name="smoothness_mean"
              placeholder="e.g. 0.10"
              step="0.01"
              {...commonProps}
            />
          </div>
          <div>
            <label>Compactness Mean (Pixels)</label>
            <input
              name="compactness_mean"
              placeholder="e.g. 0.15"
              step="0.01"
              {...commonProps}
            />
          </div>
          <div>
            <label>Concavity Mean (Pixels)</label>
            <input
              name="concavity_mean"
              placeholder="e.g. 0.12"
              step="0.01"
              {...commonProps}
            />
          </div>
          <div>
            <label>Concave Points Mean (Pixels)</label>
            <input
              name="concave_points_mean"
              placeholder="e.g. 0.06"
              step="0.01"
              {...commonProps}
            />
          </div>
          <div>
            <label>Symmetry Mean (Pixels)</label>
            <input
              name="symmetry_mean"
              placeholder="e.g. 0.18"
              step="0.01"
              {...commonProps}
            />
          </div>
          <div>
            <label>Fractal Dimension Mean (Pixels)</label>
            <input
              name="fractal_dimension_mean"
              placeholder="e.g. 0.06"
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
            <label>Radius (Pixels)</label>
            <input name="radius" type="number" step="0.01" placeholder="e.g. 14.32" {...commonProps} />
          </div>
          <div>
            <label>Texture (Pixels)</label>
            <input name="texture" type="number" step="0.01" placeholder="e.g. 19.85" {...commonProps} />
          </div>
          <div>
            <label>Perimeter (Pixels)</label>
            <input name="perimeter" type="number" step="0.01" placeholder="e.g. 88.20" {...commonProps} />
          </div>
          <div>
            <label>Area (Pixels)</label>
            <input name="area" type="number" step="0.01" placeholder="e.g. 500.30" {...commonProps} />
          </div>
          <div>
            <label>Smoothness (Pixels)</label>
            <input name="smoothness" type="number" step="0.01" placeholder="e.g. 0.10" {...commonProps} />
          </div>
          <div>
            <label>Compactness (Pixels)</label>
            <input name="compactness" type="number" step="0.01" placeholder="e.g. 0.75" {...commonProps} />
          </div>
          <div>
            <label>Symmetry (Pixels)</label>
            <input name="symmetry" type="number" step="0.01" placeholder="e.g. 0.42" {...commonProps} />
          </div>
          <div>
            <label>Fractal Dimension (Pixels)</label>
            <input name="fractal_dimension" type="number" step="0.01" placeholder="e.g. 0.06" {...commonProps} />
          </div>
        </>
      );

    } else if (selectedCancer === 'Colorectal Cancer') {
      return (
        <>
          {selectedGenes.map((gene, i) => (
            <div key={i} className="form-group">
              <label>{`Gene: ${gene} (Expression in Transcripts Per Million)`}</label>
              <input
                name={gene}
                type="number"
                step="0.01"
                placeholder={`Enter expression for ${gene}`}
                value={formData[gene] || ''}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          ))}
        </>
      );
    } else if (selectedCancer === 'Lung Cancer') {
      return (
        <div className="lung-cancer-form-grid">

          {/* Render AGE field */}
          <div className="form-group">
            <small>All data fields must be selected before proceeding.</small>
            <label>1. Age</label><small>*Required</small>
            <input
              type="number"
              name="AGE"
              placeholder="e.g. 45"
              value={formData.AGE}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          {/* Render GENDER field */}
          <div className="form-group">
            <label>2. Gender</label><small>*Required</small>
            <select
              name="GENDER"
              value={formData.GENDER}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">--Select--</option>
              <option value="1">Male</option>
              <option value="0">Female</option>
            </select>
          </div>

          {/* Render the rest of the lung fields except AGE and GENDER */}
          {lungFields
            .filter(field => field !== 'AGE' && field !== 'GENDER')
            .map((field, index) => (
              <div key={field} className="form-group">
                <label>{`${index + 3}. ${formatLabel(field)}`}</label><small>*Required</small>
                <div>
                  <label>
                    <input
                      type="radio"
                      name={field}
                      value={1}
                      checked={formData[field] === 1}
                      onChange={() => setFormData({ ...formData, [field]: 1 })}
                    />{' '}
                    Yes
                  </label>{' '}
                  <label>
                    <input
                      type="radio"
                      name={field}
                      value={0}
                      checked={formData[field] === 0}
                      onChange={() => setFormData({ ...formData, [field]: 0 })}
                    />{' '}
                    No
                  </label>
                </div>
              </div>
            ))}
        </div>
      );
    } else if (selectedCancer === 'Skin Cancer') {
      return (
        <div>
          <label>Upload the Patient's Skin Lesion Image for Analysis</label>
          <input
            name="skin_image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="form-input"
          />
        </div>
      );
    }
  }


  const endpointMap = {
    'Breast Cancer': '/predict_breast',
    'Lung Cancer': '/predict_lung',
    'Prostate Cancer': '/predict_prostate',
    'Colorectal Cancer': '/predict_colorectal',
    'Skin Cancer': '/predict_skin',
    'Survival Prediction': '/predict_survival',
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload;
    let requestOptions;

    if (selectedCancer === "Skin Cancer") {
      // Special handling for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('file', formData.skin_image); // 'file' matches FastAPI param

      requestOptions = {
        method: 'POST',
        body: formDataToSend,
        // Do not set Content-Type for FormData
      };
    } else {
      // For other cancers
      if (selectedCancer === "Colorectal Cancer") {
        const geneFeatures = selectedGenes.map(gene => parseFloat(formData[gene]) || 0);
        payload = { gene_features: geneFeatures };
      } else {
        payload = formData;
      }

      requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      };
    }

    try {
      const response = await fetch(`http://localhost:8000${endpointMap[selectedCancer]}`, requestOptions);
      const result = await response.json();
      setPredictionResult(result);
    } catch (error) {
      console.error('Prediction failed:', error);
    }
  };

  const [age, setAge] = React.useState('');
  const [cancerType, setCancerType] = React.useState('');
  const [cancerStage, setCancerStage] = React.useState('');

  const handleSurvivalPrediction = async () => {
    try {
      if (!age || !cancerType || !cancerStage) {
        alert("Please fill in all fields before predicting.");
        return;
      }

      const inputData = {
        age: Number(age),
        cancer_type: cancerType,
        cancer_stage: Number(cancerStage),
      };

      console.log("Survival input data:", inputData);

      const response = await fetch('http://localhost:8000/predict_survival/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputData),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Backend error:', result);
        alert('Failed to get survival prediction: ' + (result.error || 'Unknown error'));
        return;
      }

      setSurvivalPredictionResult(result); //Store result
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to get survival prediction: ' + error.message);
    }
  };

  const fetchTreatmentPackage = async (type, stage) => {
    try {
      const response = await fetch(`http://localhost:8000/treatment/?cancer_type=${type}&cancer_stage=${stage}`);
      console.log("Fetch response:", response);

      if (!response.ok) {
        console.error("Server responded with error status:", response.status);
        throw new Error("Treatment not found");
      }

      const data = await response.json();
      console.log("Fetched treatment data:", data);

      setTreatmentPlan(data);
    } catch (err) {
      console.error("Failed to fetch treatment:", err.message);
      setTreatmentPlan([]);
    }
  };

  useEffect(() => {
    if (cancerType && survivalPredictionResult && (cancerStage || cancerStage === 0)) {
      fetchTreatmentPackage(cancerType, cancerStage);
    }
  }, [cancerType, cancerStage, survivalPredictionResult]);

  const [successMessage, setSuccessMessage] = useState('');

  const handleSaveAndDownload = async () => {
    try {
      const reportData = {
        ic,
        full_name: fullName,
        age,
        cancerType,
        cancerStage,
        diagnosis: predictionResult,
        survival: survivalPredictionResult,
        treatment: treatmentPlan,
        doctorNote,
        doctor: doctorSignature,
      };

      console.log("Report Data Sent:", reportData);  // Should show full object now

      // Send report data to backend to save in DB
      const response = await fetch("http://localhost:8000/save_report/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error("Failed to save report");
      }

      const today = new Date().toLocaleDateString();

      const doc = new jsPDF('p', 'mm', 'a4');
      doc.setFontSize(20);
      doc.setTextColor("#1f3a93");
      doc.text("OncoInsight AI - Patient Cancer Report", 105, 15, { align: "center" });

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Date: ${today}`, 200, 20, { align: "right" });

      doc.setFontSize(10);
      doc.setTextColor(0);

      // Patient Info Box
      doc.rect(10, 20, 190, 25);
      doc.text(`Name: ${reportData.full_name}`, 12, 26);
      doc.text(`IC: ${reportData.ic}   Age: ${reportData.age}`, 12, 32);
      doc.text(`Cancer Type: ${reportData.cancerType}   Stage: ${reportData.cancerStage}`, 12, 38);

      // Diagnosis
      doc.text("Diagnosis:", 10, 50);
      doc.text(`Type: ${reportData.diagnosis.cancerType}`, 14, 56);
      doc.text(`Stage: ${reportData.diagnosis.cancerStage}`, 14, 62);

      // Survival
      doc.text("Survival Prediction:", 10, 72);
      doc.text(`Estimated Time: ${reportData.survival.Survival_Years.toFixed(2)} years`, 14, 78);
      doc.text(`Severity Score: ${reportData.survival.Target_Severity_Score.toFixed(2)}%`, 14, 84);

      // Treatment
      doc.text("Treatment Package:", 10, 94);
      let y = 100;
      reportData.treatment.forEach((t) => {
        doc.text(`Type: ${t.treatment_type}, Duration: ${t.duration_weeks} weeks`, 14, y);
        y += 6;
        if (t.medications.length) {
          doc.text(`Medications: ${t.medications.join(', ')}`, 18, y);
          y += 6;
        }
        if (t.follow_up) {
          doc.text(`Follow-up: ${t.follow_up}`, 18, y);
          y += 6;
        }
        y += 2;
      });

      // Charts side by side
      if (pieRef.current && barRef.current) {
        const pieCanvas = await html2canvas(pieRef.current);
        const pieImg = pieCanvas.toDataURL('image/png');

        const barCanvas = await html2canvas(barRef.current);
        const barImg = barCanvas.toDataURL('image/png');

        // Positioning the charts: side by side at the bottom
        const imgY = y + 10; // below text
        doc.addImage(pieImg, 'PNG', 10, imgY, 90, 60);   // left side
        doc.addImage(barImg, 'PNG', 110, imgY, 90, 60);  // right side
      }

      // Doctor's Note
      doc.text("Doctor's Note:", 14, 212);
      const splitNote = doc.splitTextToSize(doctorNote, 180);
      doc.text(splitNote, 20, 220);

      // Calculate height of doctor's note block
      let noteHeight = splitNote.length * 6;
      const baseY = 220 + noteHeight + 10;

      // Next consultation
      const nextConsultDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const nextConsultDateFormatted = nextConsultDate.toLocaleDateString('en-US', options);

      doc.text("Next Consultation / Appointment:", 14, baseY);
      doc.text(`${nextConsultDateFormatted}`, 14, baseY + 6);

      // Consultation instructions (after next appointment)
      const consultationInstruction =
        "Please ensure all lab results are ready and bring necessary reports for review. Kindly proceed to have your blood pressure measured before the consultation begins.";
      const splitInstruction = doc.splitTextToSize(consultationInstruction, 180);
      const instructionY = baseY + 20;
      doc.text(splitInstruction, 20, instructionY);

      // Signature (after instructions)
      const signatureY = instructionY + splitInstruction.length * 6 + 10;
      doc.text(`Doctor In Charge:`, 14, signatureY);
      doc.text(`${doctorSignature}`, 14, signatureY + 6);
      doc.text(`Oncologist Specialist`, 14, signatureY + 12);
      doc.text(`Beacon Hospital, Petaling Jaya, Selangor`, 14, signatureY + 18);

      // Save PDF
      doc.save(`Cancer_Report_${reportData.ic}.pdf`);

      setSuccessMessage('Report saved and downloaded successfully!');

    } catch (err) {
      console.error(err);
      setSuccessMessage('');
      alert("Failed to save report.");
    }
  };

  return (
    <div className="cancer-diagnosis-page">
      <Sidebar />
      <div className="cancer-diagnosis-content">
        <h2>Cancer Diagnosis</h2>

        <div className="form-section">
          <label>Patient IC Number:</label>
          <small>Enter the patient's IC number to retrieve their medical records.</small>
          <input
            type="text"
            value={ic}
            onChange={(e) => setIc(e.target.value)}
            className="form-input"
            placeholder='Example: 123456789012'
          />
          <button onClick={handleIcSearch} className="search-button">Search</button>

          {icData && icData.patient_records && (
            <div>
              <h2>Patient Record</h2>
              <small>***Data is retrieved from the stored records.</small>
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
              <small>***Data is retrieved from the stored records.</small>
              {icData.medical_history.length === 0 ? (
                <p>No medical history found.</p>
              ) : (
                icData.medical_history.map((record, index) => (
                  <div key={index} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
                    <p><strong>Date:</strong> {record.date_recorded}</p>
                    <p><strong>Diabetes:</strong> {record.diabetes}</p>
                    <p><strong>Blood Pressure (Systolic/Diastolic):</strong> {record.systolic}/{record.diastolic} mmHg</p>
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
          <small>Please select the patient's cancer type as indicated in the medical report.</small>
          <select value={selectedCancer} onChange={handleCancerChange} className="form-select">
            <option value="">-- Select Cancer --</option>
            <option value="Breast Cancer">Breast Cancer</option>
            <option value="Lung Cancer">Lung Cancer</option>
            <option value="Prostate Cancer">Prostate Cancer</option>
            <option value="Colorectal Cancer">Colorectal Cancer</option>
            <option value="Skin Cancer">Skin Cancer</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} className="dynamic-form">
          {renderCancerForm()}

          <div className="form-section">
            <label>Upload Report / Scan Files (MRI, CT, PET, XRAY, ULTRASOUND):</label>
            <small>Insert patient's scanned image.</small>
            <input
              type="file"
              multiple
              accept="image/*,application/pdf" // restrict to image/pdf
              onChange={(e) => {
                const files = Array.from(e.target.files);
                const previews = files.map(file => ({
                  file,
                  url: URL.createObjectURL(file),
                  type: file.type,
                }));
                setUploadedScans(previews);
              }}

              className="form-input"
            />

            <small>You can upload multiple files (PDF, JPG, PNG, etc.).</small>
          </div>
          {selectedCancer && <button type="submit" className="submit-button">Diagnose</button>}

        </form>

        {predictionResult && (
          <div className="result-container">
            <h3 style={{ fontSize: '23px' }}>Diagnosis Result</h3>

            <p style={{ fontSize: '25px' }}>
              <strong>Cancer Type:</strong> {predictionResult.cancerType}
            </p>
            <p style={{ fontSize: '25px' }}>
              <strong>Cancer Stage:</strong> {predictionResult.cancerStage || "None"}
            </p>
            {predictionResult.result !== "No Cancer" && predictionResult.probability && (
              <>
                <div className="result-layout">
                  <CancerResultChart probability={predictionResult.probability} chartRef={pieRef} />

                  {uploadedScans.length > 0 && (
                    <div className="scan-preview">
                      <h4>Uploaded Scans:</h4>
                      <div className="scan-grid">
                        {uploadedScans.map((scan, index) => (
                          <div key={index} className="scan-item">
                            {scan.type.includes("image") ? (
                              <img src={scan.url} alt={`Scan ${index + 1}`} />
                            ) : (
                              <a href={scan.url} target="_blank" rel="noopener noreferrer">
                                <span role="img" aria-label="document">📄</span> View PDF Scan {index + 1}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label>
                    Age:
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      min="0"
                      max="100"
                    />
                  </label>

                  <label>
                    Cancer Type:
                    <select
                      value={cancerType}
                      onChange={(e) => setCancerType(e.target.value)}
                    >
                      <option value="">Select Type</option>
                      <option value="Breast">Breast</option>
                      <option value="Lung">Lung</option>
                      <option value="Prostate">Prostate</option>
                      <option value="Colorectal">Colorectal</option>
                      <option value="Skin">Skin</option>
                    </select>
                  </label>

                  <label>
                    Cancer Stage:
                    <select
                      value={cancerStage}
                      onChange={(e) => setCancerStage(e.target.value)}
                    >
                      <option value="">Select Stage</option>
                      <option value="0">No Cancer</option>
                      <option value="1">Stage 1</option>
                      <option value="2">Stage 2</option>
                      <option value="3">Stage 3</option>
                      <option value="4">Stage 4</option>
                    </select>
                  </label>

                  <button onClick={handleSurvivalPrediction}>Predict Survival</button>
                </div>

              </>
            )}

            {predictionResult.result === "No Cancer" && (
              <div>
                <label>
                  Age:
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="0"
                    max="120"
                  />
                </label>
                <button onClick={handleSurvivalPrediction}>Predict Survival</button>
              </div>
            )}
          </div>
        )}

        {survivalPredictionResult && (
          <div className="result-container">
            <h4 style={{ fontSize: '23px' }}>Survival Prediction</h4>
            <p style={{ fontSize: '23px' }}>
              <strong>Predicted Survival Time:</strong> {survivalPredictionResult.Survival_Years.toFixed(2)} years
            </p>
            <p style={{ fontSize: '23px' }}>
              <strong>Target Severity Score:</strong> {survivalPredictionResult.Target_Severity_Score.toFixed(2)}%
            </p>

            <SurvivalPredictionChart
              survivalYears={survivalPredictionResult.Survival_Years}
              severityScore={survivalPredictionResult.Target_Severity_Score}
              chartRef={barRef}
            />
          </div>
        )}

        {treatmentPlan.length > 0 && predictionResult.result !== "No Cancer" && (
          <div className="result-container">
            <h4 style={{ fontSize: '23px' }}>Treatment Recommendation</h4>
            {treatmentPlan.map((treatment, index) => (
              <div key={index} className="treatment-item" style={{ marginBottom: '20px' }}>
                <p><strong>Type:</strong> {treatment.treatment_type}</p>
                <p><strong>Duration:</strong> {treatment.duration_weeks} weeks</p>
                {treatment.medications.length > 0 && (
                  <p><strong>Medications:</strong> {treatment.medications.join(', ')}</p>
                )}
                {treatment.follow_up && (
                  <p><strong>Follow-up:</strong> {treatment.follow_up}</p>
                )}
                <hr />
              </div>
            ))}

            {/* Next Consultation Section */}
            <div className="appointment-section" style={{ marginTop: '30px' }}>
              <h4 style={{ fontSize: '23px' }}>Next Consultation / Appointment</h4>
              <p style={{ fontSize: '20px' }}>
                <strong>Scheduled Date:</strong> {
                  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                }
              </p>
              <p style={{ fontSize: '18px', color: '#555' }}>
                Please ensure all lab results are ready and bring necessary reports for review. Kindly proceed to have your blood pressure measured before the consultation begins.
              </p>
            </div>

            <div className="doctor-inputs">
              <label>
                <strong>Doctor's Note:</strong><br />
                <textarea
                  rows="4"
                  cols="50"
                  value={doctorNote}
                  onChange={(e) => setDoctorNote(e.target.value)}
                  placeholder="Enter doctor's observation or advice..."
                />
              </label>

              <br />
              <label>
                <strong>Doctor In Charge:</strong><br />
                <input
                  value={doctorSignature}
                  readOnly
                  placeholder="Dr. Badrul Bin Mahmod"
                />
              </label>
            </div>

            <div className="treatment-actions" style={{ marginTop: '15px' }}>
              <button onClick={handleSaveAndDownload}>Save and Download Report</button>
            </div>

            {/* Success message below the button */}
            {successMessage && (
              <p style={{ color: 'green', marginTop: '10px' }}>{successMessage}</p>
            )}
          </div>
        )}
      </div>
    </div >
  );
};

export default CancerDiagnosis;