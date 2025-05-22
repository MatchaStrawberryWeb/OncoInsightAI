import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../css/DetailedReport.css";
import Sidebar from './Sidebar';

const DetailedReport = () => {
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchIc, setSearchIc] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8000/detailed_report/")
            .then((response) => {
                setReports(response.data);
                setFilteredReports(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching reports:", error);
                setLoading(false);
            });
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchIc(value);
        if (value.trim() === "") {
            setFilteredReports(reports);
        } else {
            const filtered = reports.filter(report =>
                report.ic.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredReports(filtered);
        }
    };

    const formatDiagnosis = (diag) => {
        try {
            const obj = JSON.parse(diag);
            return `Type: ${obj.cancerType}, Stage: ${obj.cancerStage}, Probability: ${(obj.probability * 100).toFixed(2)}%`;
        } catch {
            return diag;
        }
    };

    const formatSurvival = (surv) => {
        try {
            const obj = JSON.parse(surv);
            return `Survival Years: ${obj.Survival_Years.toFixed(2)}, Severity Score: ${obj.Target_Severity_Score.toFixed(2)}`;
        } catch {
            return surv;
        }
    };

    const formatTreatmentText = (treat) => {
        try {
            const arr = JSON.parse(treat);
            return arr.map((item, i) => {
                return `${i + 1}. ${item.treatment_type} (Duration: ${item.duration_weeks} week(s))` +
                    (item.medications ? `\n   Medications: ${item.medications.join(", ")}` : "") +
                    (item.follow_up ? `\n   Follow-up: ${item.follow_up}` : "");
            }).join("\n\n");
        } catch {
            return treat;
        }
    };

    const generatePDF = (report) => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Cancer Diagnosis Report", 14, 20);

        doc.setFontSize(12);
        doc.text(`IC Number: ${report.ic}`, 14, 35);
        doc.text(`Age: ${report.age}`, 14, 43);
        doc.text(`Cancer Type: ${report.cancer_type}`, 14, 51);
        doc.text(`Cancer Stage: ${report.cancer_stage || "N/A"}`, 14, 59);
        doc.text(`Created At: ${new Date(report.created_at).toLocaleString()}`, 14, 67);

        doc.setFontSize(14);
        doc.text("Diagnosis", 14, 80);
        doc.setFontSize(12);
        doc.text(doc.splitTextToSize(formatDiagnosis(report.diagnosis), 180), 14, 88);

        doc.setFontSize(14);
        doc.text("Survival Prediction", 14, 110);
        doc.setFontSize(12);
        doc.text(doc.splitTextToSize(formatSurvival(report.survival), 180), 14, 118);

        doc.setFontSize(14);
        doc.text("Recommended Treatment", 14, 140);
        doc.setFontSize(12);
        doc.text(doc.splitTextToSize(formatTreatmentText(report.treatment), 180), 14, 148);

        doc.setFontSize(14);
        doc.text("Doctor's Note", 14, 180);
        doc.setFontSize(12);
        doc.text(doc.splitTextToSize(report.doctor_note || "N/A", 180), 14, 188);

        doc.setFontSize(14);
        doc.text("Doctor In Charge", 14, 220);
        doc.setFontSize(12);
        doc.text(report.doctor_signature || "N/A", 14, 228);

        doc.save(`Report_${report.ic}.pdf`);
    };

    if (loading) return <div className="loading">Loading reports...</div>;

    return (
        <div className="report-container">
            <Sidebar />
            <div className="main-content">
                <h2>Patient's Cancer Diagnosis Reports</h2>

                <input
                    type="text"
                    placeholder="Search by IC number..."
                    value={searchIc}
                    onChange={handleSearchChange}
                    style={{
                        marginBottom: "20px",
                        padding: "8px",
                        width: "250px",
                        fontSize: "16px",
                    }}
                />

                <table className="report-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>IC</th>
                            <th>Age</th>
                            <th>Cancer Type</th>
                            <th>Cancer Stage</th>
                            <th>Diagnosis</th>
                            <th>Survival</th>
                            <th>Treatment</th>
                            <th>Doctor's Note</th> {/* Added */}
                            <th>Doctor In Charge</th> {/* Added */}
                            <th>Created At</th>
                            <th>Download</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReports.length === 0 ? (
                            <tr>
                                <td colSpan="12" style={{ textAlign: "center" }}>
                                    No reports found.
                                </td>
                            </tr>
                        ) : (
                            filteredReports.map((report) => {
                                let cancerStageDisplay = "No Cancer";
                                try {
                                    const diagObj = JSON.parse(report.diagnosis);
                                    if (diagObj.cancerStage?.trim()) {
                                        cancerStageDisplay = diagObj.cancerStage;
                                    } else if (report.cancer_stage?.trim()) {
                                        cancerStageDisplay = report.cancer_stage;
                                    }
                                } catch {
                                    if (report.cancer_stage?.trim()) {
                                        cancerStageDisplay = report.cancer_stage;
                                    }
                                }

                                return (
                                    <tr key={report.id}>
                                        <td>{report.id}</td>
                                        <td>{report.ic}</td>
                                        <td>{report.age}</td>
                                        <td>{report.cancer_type}</td>
                                        <td>{cancerStageDisplay}</td>
                                        <td>{formatDiagnosis(report.diagnosis)}</td>
                                        <td>{formatSurvival(report.survival)}</td>
                                        <td><pre style={{ whiteSpace: "pre-wrap" }}>{formatTreatmentText(report.treatment)}</pre></td>

                                        {/* New cells for doctor's note and signature */}
                                        <td><pre style={{ whiteSpace: "pre-wrap" }}>{report.doctor_note || "N/A"}</pre></td>
                                        <td>{report.doctor_signature || "N/A"}</td>

                                        <td>{new Date(report.created_at).toLocaleString()}</td>
                                        <td>
                                            <button onClick={() => generatePDF(report)}>
                                                Download PDF
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

};

export default DetailedReport;
