import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/BreastCancer.css";
import Sidebar from './Sidebar';

const BreastCancerPage = () => {
  const [forums, setForums] = useState([]);
  const [newForumTitle, setNewForumTitle] = useState("");
  const [newReplyText, setNewReplyText] = useState("");
  const [selectedForumId, setSelectedForumId] = useState(null);

  const [documents, setDocuments] = useState([]);
  const [documentTitle, setDocumentTitle] = useState("");
  const [file, setFile] = useState(null);

  // Load forums and documents on mount
  useEffect(() => {
    fetchForums();
    fetchDocuments();
  }, []);

  const fetchForums = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/forum/');
      setForums(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/forum/documents');
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Create new forum
  const addForum = async () => {
    if (!newForumTitle.trim()) return;
    try {
      await axios.post("http://localhost:8000/api/forum/", { title: newForumTitle });
      setNewForumTitle("");
      fetchForums();
    } catch (err) {
      console.error(err);
    }
  };

  // Create reply
  const addReply = async (forumId) => {
    if (!newReplyText.trim()) return;
    try {
      await axios.post(`http://localhost:8000/api/forum/${forumId}/replies`, {
        reply_text: newReplyText,
        author: "Dr. CurrentUser",
      });
      setNewReplyText("");
      setSelectedForumId(null);
      fetchForums();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle document upload
  const handleDocumentSubmit = async (e) => {
    e.preventDefault();
    if (!documentTitle || !file) return alert("Please fill out all fields.");

    const formData = new FormData();
    formData.append("title", documentTitle);
    formData.append("uploaded_by", "Doctor");
    formData.append("file", file);

    try {
      await axios.post("http://localhost:8000/api/forum/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDocumentTitle("");
      setFile(null);
      fetchDocuments();
      alert("Document uploaded successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="container">
      <Sidebar />

      <div className="breast-cancer-page">
        <h1>Breast Cancer Department</h1>

        {/* Doctor Image Section */}
        <div className="doctor-hierarchy">
          <h2>Doctors in the Breast Cancer Department</h2>
          <div className="doctor-org-chart">
            <img
              src="/doctorChart.jpeg"
              alt="Breast Cancer Department Organization Chart"
              className="org-image"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
        </div>

        {/* Upload Document Section */}
        <div className="upload-documents">
          <h2>Upload Documents About Breast Cancer</h2>
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

          {/* Show uploaded documents */}
          <div className="documents-list" style={{ marginTop: "20px" }}>
            <h3>Uploaded Documents</h3>
            <ul>
              {documents.map((doc) => (
                <li key={doc.id}>
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                    {doc.title}
                  </a> by {doc.uploaded_by}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Forum Section */}
        <div className="forum-section">
          <h2>Discussion Forum</h2>

          <div className="create-forum" style={{ marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="Create a new discussion"
              value={newForumTitle}
              onChange={(e) => setNewForumTitle(e.target.value)}
            />
            <button
              onClick={addForum}
              disabled={newForumTitle.trim() === ""}
            >
              Create Forum
            </button>
          </div>

          <ul className="forums">
            {forums.map((forum) => (
              <li key={forum.id} style={{ marginBottom: "20px" }}>
                <h3>{forum.title}</h3>

                {/* Show replies if any */}
                {forum.replies && forum.replies.length > 0 ? (
                  <ul>
                    {forum.replies.map((reply) => (
                      <li key={reply.id}>
                        <b>{reply.author}:</b> {reply.reply_text}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No replies yet. Be the first to reply!</p>
                )}

                {/* Reply input & button */}
                {selectedForumId === forum.id ? (
                  <div style={{ marginTop: "10px" }}>
                    <input
                      type="text"
                      placeholder="Write your reply"
                      value={newReplyText}
                      onChange={(e) => setNewReplyText(e.target.value)}
                    />
                    <button onClick={() => addReply(forum.id)} disabled={newReplyText.trim() === ""}>
                      Submit Reply
                    </button>
                    <button onClick={() => { setSelectedForumId(null); setNewReplyText(""); }} style={{ marginLeft: "5px" }}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setSelectedForumId(forum.id)}>Reply</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BreastCancerPage;
