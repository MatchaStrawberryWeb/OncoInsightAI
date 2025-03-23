import React, { useState } from "react";
import "../css/LungCancer.css";
import Sidebar from '../components/Sidebar'; // Make sure this path is correct

const LungCancerPage = () => {
  const [forums, setForums] = useState([]);
  const [newForum, setNewForum] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [file, setFile] = useState(null);

  const addForum = () => {
    if (newForum.trim() !== "") {
      setForums([...forums, { id: forums.length + 1, title: newForum }]);
      setNewForum("");
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDocumentSubmit = (event) => {
    event.preventDefault();

    if (documentTitle.trim() !== "" && file) {
      console.log("Document Title:", documentTitle);
      console.log("Uploaded File:", file);
      // Add file upload logic here
      setDocumentTitle("");
      setFile(null);
      alert("Document uploaded successfully!");
    } else {
      alert("Please fill out all fields.");
    }
  };

  return (
    <div className="container">
      {/* Use Sidebar component */}
      <Sidebar />

      <div className="lung-cancer-page">
        <h1>Lung Cancer Department</h1>

        {/* Doctor Hierarchy Section */}
        <div className="doctor-hierarchy">
          <h2>Doctors in the Lung Cancer Department</h2>
          <ul className="hierarchy">
            <li>
              Head of Department: Dr. Sarah Razali
              <ul>
                <li>Senior Consultant: Dr. Amirul Hadi</li>
                <li>Senior Consultant: Dr. Emily Brown</li>
                <li>
                  Junior Doctors
                  <ul>
                    <li>Dr. Maisarah Zainal</li>
                    <li>Dr. Kumar</li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        {/* Upload Document Section */}
        <div className="upload-documents">
          <h2>Upload Documents About Lung Cancer</h2>
          <form onSubmit={handleDocumentSubmit}>
            <label>Document Title:</label>
            <input
              type="text"
              placeholder="Enter document title"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              required
            />
            <label>Upload File:</label>
            <input
              type="file"
              accept=".pdf, .docx, .txt, .png, .jpg"
              onChange={handleFileChange}
              required
            />
            <button type="submit">Upload</button>
          </form>
        </div>

        {/* Forum Section */}
        <div className="forum-section">
          <h2>Discussion Forum</h2>
          <div className="create-forum">
            <input
              type="text"
              placeholder="Create a new discussion"
              value={newForum}
              onChange={(e) => setNewForum(e.target.value)}
            />
            <button
              onClick={addForum}
              disabled={newForum.trim() === ""}
            >
              Create Forum
            </button>
          </div>
          <ul className="forums">
            {forums.map((forum) => (
              <li key={forum.id}>
                <h3>{forum.title}</h3>
                <p>No replies yet. Be the first to reply!</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LungCancerPage;
