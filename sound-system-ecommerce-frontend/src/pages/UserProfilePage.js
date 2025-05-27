// src/pages/UserProfilePage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './UserProfilePage.css';

function UserProfilePage() {
  // Call useAuth() once at the top level
  const { currentUser, updateUserProfile, loadingAuthState } = useAuth(); 
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // Email will be read-only
  const [message, setMessage] = useState(''); // For success/error messages

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  // Use the destructured loadingAuthState here
  if (loadingAuthState) { 
    return <p>Loading user profile...</p>;
  }

  // Use the destructured currentUser here
  if (!currentUser) { 
    return <p>User not found or not logged in.</p>;
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setMessage(''); // Clear any previous messages
    // Reset name to current user's name if cancelling edit
    if (isEditing && currentUser) {
      setName(currentUser.name || '');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    if (!name.trim()) {
      setMessage('Name cannot be empty.');
      return;
    }
    const success = updateUserProfile({ name });
    if (success) {
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } else {
      setMessage('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="user-profile-page-container">
      <div className="user-profile-card">
        <h2>User Profile</h2>
        {message && <p className={`profile-message ${message.includes('successfully') ? 'success' : 'error'}`}>{message}</p>}
        
        {!isEditing ? (
          <>
            <div className="profile-info-item">
              {/* currentUser is guaranteed to be non-null here due to checks above */}
              <strong>Name:</strong> <span>{currentUser.name || 'N/A'}</span>
            </div>
            <div className="profile-info-item">
              <strong>Email:</strong> <span>{currentUser.email}</span>
            </div>
            <div className="profile-info-item">
              <strong>User ID:</strong> <span>{currentUser.id}</span>
            </div>
            <button onClick={handleEditToggle} className="edit-profile-button">
              Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="profile-edit-form">
            <div className="form-group">
              <label htmlFor="userName">Name:</label>
              <input
                type="text"
                id="userName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="userEmail">Email:</label>
              <input
                type="email"
                id="userEmail"
                value={email}
                readOnly 
                disabled 
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="admin-button save-button">Save Changes</button>
              <button type="button" onClick={handleEditToggle} className="admin-button cancel-button">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default UserProfilePage;