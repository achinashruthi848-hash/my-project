import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [panicAnim, setPanicAnim] = useState(false);

  const fetchAlerts = () => {
    api.get('/api/emergency').then((res) => {
      setAlerts(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleEmergencyAlert = () => {
    setSending(true);
    setPanicAnim(true);
    api.post('/api/emergency', { location: null })
      .then(() => {
        fetchAlerts();
        setTimeout(() => setPanicAnim(false), 800);
      })
      .catch(() => alert('Failed to send alert. Try again.'))
      .finally(() => setSending(false));
  };

  return (
    <div className="page dashboard-page">
      <div className="container">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-sub">Welcome back, {user?.name}.</p>

        <div className="dashboard-grid">
          <div className="card emergency-card">
            <h2>Emergency Alert</h2>
            <p>One tap to send your location and alert to your emergency contacts.</p>
            <button
              type="button"
              className={`btn btn-danger btn-panic ${panicAnim ? 'panic-active' : ''}`}
              onClick={handleEmergencyAlert}
              disabled={sending}
            >
              {sending ? 'Sending...' : '🚨 Send Emergency Alert'}
            </button>
          </div>

          <div className="card quick-links">
            <h2>Quick Actions</h2>
            <Link to="/contacts" className="quick-link">👥 Emergency Contacts</Link>
            <Link to="/report" className="quick-link">📋 Report Incident</Link>
            <Link to="/safety-tips" className="quick-link">💡 Safety Tips</Link>
            <Link to="/profile" className="quick-link">👤 Profile</Link>
          </div>
        </div>

        <div className="card alerts-section">
          <h2>Past Alerts</h2>
          {loading ? (
            <p>Loading...</p>
          ) : alerts.length === 0 ? (
            <p className="muted">No alerts yet. Your emergency alerts will appear here.</p>
          ) : (
            <ul className="alerts-list">
              {alerts.map((a) => (
                <li key={a.id}>
                  <span className="alert-time">{new Date(a.timestamp).toLocaleString()}</span>
                  {a.location && <span className="alert-loc">{a.location}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
