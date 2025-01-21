import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Profile.css";

const Profile = () => {
  const [user, setUser] = useState({
    fullName: "Not Available",
    username: "Not Available",
    department: "Not Available",
    photoId: "https://via.placeholder.com/150",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage

        if (!token) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        // Make API request with the token
        const response = await axios.get("http://127.0.0.1:8000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the Bearer token
          },
        });

        // Set the response data to the user state
        setUser({
          fullName: response.data.fullName || "Not Available",
          username: response.data.username || "Not Available",
          department: response.data.department || "Not Available",
          photoId: response.data.photoId || "https://via.placeholder.com/150",
        });
      } catch (err) {
        // Handle errors from the API
        setError(err.response?.data?.detail || "Error fetching profile data");
      } finally {
        setLoading(false); // Set loading to false after the API call
      }
    };

    fetchProfile(); // Fetch profile when the component mounts
  }, []); // Empty dependency array ensures this runs only once

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <div className="profile-card">
        <div className="profile-photo">
          <img src={user.photoId} alt="Profile" />
        </div>
        <div className="profile-info">
          <div className="profile-item">
            <strong>Full Name:</strong> {user.fullName}
          </div>
          <div className="profile-item">
            <strong>Username:</strong> {user.username}
          </div>
          <div className="profile-item">
            <strong>Department:</strong> {user.department}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
