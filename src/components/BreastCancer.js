import React, { useState } from "react";
import "../css/BreastCancerPage.css";

const BreastCancerPage = () => {
  const [forums, setForums] = useState([]);
  const [newForum, setNewForum] = useState("");

  const addForum = () => {
    if (newForum.trim() !== "") {
      setForums([...forums, { id: forums.length + 1, title: newForum }]);
      setNewForum("");
    }
  };

  return (
    <div className="breast-cancer-page">
      <h1>Breast Cancer Department</h1>

      {/* Doctor Hierarchy Section */}
      <div className="doctor-hierarchy">
        <h2>Doctors in the Breast Cancer Department</h2>
        <ul className="hierarchy">
          <li>
            Head of Department: Dr. Sarah Johnson
            <ul>
              <li>Senior Consultant: Dr. Mark Lee</li>
              <li>Senior Consultant: Dr. Emily Brown</li>
              <li>
                Junior Doctors
                <ul>
                  <li>Dr. Jane Doe</li>
                  <li>Dr. John Smith</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      {/* Upload Document Section */}
      <div className="upload-documents">
        <h2>Upload Documents About Breast Cancer</h2>
        <form>
          <label>Document Title:</label>
          <input type="text" placeholder="Enter document title" required />
          <label>Upload File:</label>
          <input type="file" accept=".pdf, .docx, .txt, .png, .jpg" required />
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
          <button onClick={addForum}>Create Forum</button>
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
  );
};

export default BreastCancerPage;
