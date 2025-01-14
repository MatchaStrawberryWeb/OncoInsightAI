import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import PropTypes from 'prop-types';
import '../css/Report.css';

const Report = ({ patientDetails, diagnosis, survivalPrediction, treatmentGuidance }) => {
    const reportRef = useRef(null); // Ref to capture the report for export/print

    // Function to export the report as a PDF
    const exportPDF = async () => {
        const reportElement = reportRef.current;
        const canvas = await html2canvas(reportElement);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = (canvas.height * pageWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
        pdf.save('Patient_Report.pdf');
    };

    // Function to trigger browser's print functionality
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="report-container" ref={reportRef}>
            <h1>Patient Report</h1>
            
            {/* Patient Details Section */}
            <section>
                <h2>Patient Details</h2>
                <p><strong>Name:</strong> {patientDetails?.full_name || 'N/A'}</p>
                <p><strong>Age:</strong> {patientDetails?.age || 'N/A'}</p>
                <p><strong>Gender:</strong> {patientDetails?.gender || 'N/A'}</p>
            </section>

            {/* Cancer Diagnosis Section */}
            <section>
                <h2>Cancer Diagnosis</h2>
                <p><strong>Cancer Type:</strong> {diagnosis?.cancerType || 'N/A'}</p>
                <p><strong>Cancer Level:</strong> {diagnosis?.cancerLevel || 'N/A'}</p>
            </section>

            {/* Survival Prediction Section */}
            <section>
                <h2>Survival Prediction</h2>
                <p><strong>Survival Rate:</strong> {survivalPrediction?.survivalRate || 'N/A'}</p>
                <p><strong>Prognosis:</strong> {survivalPrediction?.prognosis || 'N/A'}</p>
                <div className="graph-container">
                    <img src="path/to/graph.png" alt="Survival Prediction Graph" />
                </div>
            </section>

            {/* Treatment Guidance Section */}
            <section>
                <h2>Treatment Guidance</h2>
                <p><strong>Treatment Type:</strong> {treatmentGuidance?.treatmentType || 'N/A'}</p>
                <p><strong>Recommended Drugs:</strong> {treatmentGuidance?.recommendedDrugs.join(', ') || 'N/A'}</p>
                <p><strong>Treatment Duration:</strong> {treatmentGuidance?.treatmentDuration || 'N/A'}</p>
                <p><strong>Hospital Plan Package:</strong> {treatmentGuidance?.hospitalPlan || 'N/A'}</p>
            </section>

            {/* Export/Print Buttons */}
            <div className="report-buttons">
                <button onClick={exportPDF} className="export-pdf-button">
                    Export as PDF
                </button>
                <button onClick={handlePrint} className="print-button">
                    Print Report
                </button>
            </div>
        </div>
    );
};

// Prop validation using PropTypes
Report.propTypes = {
    patientDetails: PropTypes.shape({
        full_name: PropTypes.string.isRequired,
        age: PropTypes.number.isRequired,
        gender: PropTypes.string.isRequired,
    }).isRequired,
    diagnosis: PropTypes.shape({
        cancerType: PropTypes.string.isRequired,
        cancerLevel: PropTypes.string.isRequired,
    }).isRequired,
    survivalPrediction: PropTypes.shape({
        survivalRate: PropTypes.number.isRequired,
        prognosis: PropTypes.string.isRequired,
    }).isRequired,
    treatmentGuidance: PropTypes.shape({
        treatmentType: PropTypes.string.isRequired,
        recommendedDrugs: PropTypes.arrayOf(PropTypes.string).isRequired,
        treatmentDuration: PropTypes.string.isRequired,
        hospitalPlan: PropTypes.string.isRequired,
    }).isRequired,
};

export default Report;
