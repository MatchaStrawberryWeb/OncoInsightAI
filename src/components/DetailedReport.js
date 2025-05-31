import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import Sidebar from "./Sidebar";
import "../css/DetailedReport.css"; // Assuming you have a CSS file for styling

const DetailedReport = () => {
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchIc, setSearchIc] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const reportsPerPage = 5;
    const [selectedCancerType, setSelectedCancerType] = useState("All");
    const [selectedStage, setSelectedStage] = useState("All");


    useEffect(() => {
        axios.get("http://localhost:8000/detailed_report/")
            .then((response) => {
                console.log("Fetched reports:", response.data); // 👈 add this
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
        setCurrentPage(1);
        filterReports(value, selectedCancerType, selectedStage);
    };

    const filterReports = (ic, cancerType, stage) => {
        let filtered = reports;

        if (ic.trim() !== "") {
            filtered = filtered.filter((report) =>
                report.ic.toLowerCase().includes(ic.toLowerCase())
            );
        }

        if (cancerType !== "All") {
            filtered = filtered.filter((report) =>
                report.cancer_type.toLowerCase().includes(cancerType.toLowerCase())
            );
        }

        if (stage !== "All") {
            const selectedStageNum = parseInt(stage); // convert to number
            filtered = filtered.filter((report) =>
                Number(report.cancer_stage) === selectedStageNum
            );
        }

        setFilteredReports(filtered);
    };


    const handleStageChange = (e) => {
        const value = e.target.value;
        setSelectedStage(value);
        setCurrentPage(1);
        filterReports(searchIc, selectedCancerType, value);
    };


    const handleCancerTypeChange = (e) => {
        const value = e.target.value;
        setSelectedCancerType(value);
        setCurrentPage(1);
        filterReports(searchIc, value, selectedStage);
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

        const treatmentText = doc.splitTextToSize(formatTreatmentText(report.treatment), 180);
        doc.text(treatmentText, 14, 148);

        // Calculate the next Y position dynamically
        let nextY = 148 + treatmentText.length * 7; // adjust line height if needed

        doc.setFontSize(14);
        doc.text("Doctor's Note", 14, nextY);
        doc.setFontSize(12);

        const doctorNoteText = doc.splitTextToSize(report.doctor_note || "N/A", 180);
        doc.text(doctorNoteText, 14, nextY + 8);

        // Continue similarly for doctor's signature:
        nextY = nextY + 8 + doctorNoteText.length * 7;

        doc.setFontSize(14);
        doc.text("Doctor In Charge", 14, nextY);
        doc.setFontSize(12);
        doc.text(report.doctor_signature || "N/A", 14, nextY + 8);

        doc.save(`Report_${report.ic}.pdf`);
    };

    if (loading) return <div className="loading">Loading reports...</div>;

    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);

    const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="page-layout">
            <Sidebar />
            <div className="report-container">
                <h2>Detailed Patient Reports</h2>

                <div className="filters">
                    <input
                        type="text"
                        placeholder="Search by IC number"
                        value={searchIc}
                        onChange={handleSearchChange}
                    />
                    <select value={selectedCancerType} onChange={handleCancerTypeChange}>
                        <option value="All">All Cancer Types</option>
                        <option value="Breast">Breast Cancer</option>
                        <option value="Lung">Lung Cancer</option>
                        <option value="Skin">Skin Cancer</option>
                        <option value="Colorectal">Colorectal Cancer</option>
                        <option value="Prostate">Prostate Cancer</option>
                    </select>

                    <select value={selectedStage} onChange={handleStageChange}>
                        <option value="All">All</option>
                        <option value="0">Stage 0</option>
                        <option value="1">Stage 1</option>
                        <option value="2">Stage 2</option>
                        <option value="3">Stage 3</option>
                        <option value="4">Stage 4</option>
                    </select>

                </div>

                {currentReports.length === 0 ? (
                    <p>No matching reports found.</p>
                ) : (
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th>IC</th>
                                <th>Age</th>
                                <th>Cancer Type</th>
                                <th>Diagnosis</th>
                                <th>Survival</th>
                                <th>Treatment</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentReports.map((report) => (
                                <tr key={report.id}>
                                    <td>{report.ic}</td>
                                    <td>{report.age}</td>
                                    <td>{report.cancer_type}</td>
                                    <td>{formatDiagnosis(report.diagnosis)}</td>
                                    <td>{formatSurvival(report.survival)}</td>
                                    <td>
                                        <pre>{formatTreatmentText(report.treatment)}</pre>
                                    </td>
                                    <td>
                                        <button onClick={() => generatePDF(report)}>Download PDF</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <div className="pagination">
                    {pageNumbers.map((number) => (
                        <button
                            key={number}
                            className={currentPage === number ? "active" : ""}
                            onClick={() => setCurrentPage(number)}
                        >
                            {number}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DetailedReport;
