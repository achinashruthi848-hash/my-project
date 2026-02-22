import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Auth.css';

export default function Profile() {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/auth/me')
      .then((res) => {
        setProfile(res.data);
        setNameInput(res.data.name);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setError('');
    api.put('/api/auth/profile', { name: nameInput.trim() })
      .then((res) => {
        setProfile(res.data);
        setEditing(false);
        login({ ...user, name: res.data.name }, localStorage.getItem('token'));
      })
      .catch((err) => setError(err.response?.data?.message || 'Update failed'));
  };

  if (loading) return <div className="page"><div className="container"><p>Loading...</p></div></div>;

  return (
    <div className="page auth-page">
      <div className="container auth-container">
        <div className="card auth-card">
          <h1>Profile</h1>
          <p className="auth-sub">Manage your account.</p>
          {error && <div className="alert alert-danger">{error}</div>}
          {!editing ? (
            <>
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Role:</strong> {profile.role}</p>
              <button type="button" className="btn btn-primary" onClick={() => setEditing(true)}>Edit Name</button>
            </>
          ) : (
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Name</label>
                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn btn-secondary" style={{ marginLeft: '0.5rem' }} onClick={() => setEditing(false)}>Cancel</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
