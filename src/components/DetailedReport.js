import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DetailedReport.css";

const DetailedReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/patient_reports/")
      .then((response) => {
        setReports(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading reports...</div>;

  return (
    <div className="report-container">
      <h2>Patient Reports</h2>
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
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{report.id}</td>
              <td>{report.ic}</td>
              <td>{report.age}</td>
              <td>{report.cancer_type}</td>
              <td>{report.cancer_stage}</td>
              <td>{report.diagnosis}</td>
              <td>{report.survival}</td>
              <td>{report.treatment}</td>
              <td>{new Date(report.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DetailedReport;
