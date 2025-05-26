import React, { useEffect, useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",  // <-- IMPORTANT: send session cookie
        });

        if (!response.ok) {
          const errorDetails = await response.json();
          throw new Error(errorDetails.detail || "Failed to fetch profile data.");
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Error fetching profile data. Please try again.");
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h2>Profile Details</h2>
      <p><strong>Full Name:</strong> {profile.fullName}</p>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Department:</strong> {profile.department}</p>
      <p><strong>Joined On:</strong> {profile.createdAt}</p>
    </div>
  );
};

export default Profile;
