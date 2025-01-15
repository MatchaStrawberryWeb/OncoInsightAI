import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/Profile.css";

const Profile = () => {
  const [user, setUser] = useState({
    photoId: 'https://via.placeholder.com/150', // Default mockup photo
    fullName: '',
    username: '',
    department: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log("Token from localStorage:", token);  // Debugging log
        if (!token) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }
  
        const response = await axios.get('http://127.0.0.1:8000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setUser({
          fullName: response.data.fullName,
          username: response.data.username,
          department: response.data.department,
          photoId: response.data.photoId || 'https://via.placeholder.com/150',
        });
      } catch (err) {
        setError(err.response?.data?.detail || 'Error fetching profile data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, []);
  
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
            <strong>Full Name:</strong> {user.fullName || 'Not Available'}
          </div>
          <div className="profile-item">
            <strong>Username:</strong> {user.username || 'Not Available'}
          </div>
          <div className="profile-item">
            <strong>Department:</strong> {user.department || 'Not Available'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
