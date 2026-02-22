import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Report.css';

export default function ReportIncident() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    description: '',
    location: '',
    date: new Date().toISOString().slice(0, 10),
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const fetchReports = () => {
    api.get('/api/reports').then((res) => {
      setReports(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.date) e.date = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(false);
    if (!validate()) return;
    api.post('/api/reports', {
      description: form.description.trim(),
      location: form.location.trim() || null,
      date: form.date,
    })
      .then(() => {
        setForm({ description: '', location: '', date: new Date().toISOString().slice(0, 10) });
        setSuccess(true);
        fetchReports();
      })
      .catch((err) => alert(err.response?.data?.message || 'Submit failed'));
  };

  return (
    <div className="page report-page">
      <div className="container">
        <h1 className="page-title">Report Incident</h1>
        <p className="page-sub">Document an incident with location, date, and description.</p>

        <div className="card form-card">
          <h2>New Report</h2>
          {success && <div className="alert alert-success">Report submitted successfully.</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What happened?"
                rows={4}
              />
              {errors.description && <span className="error">{errors.description}</span>}
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Where did it happen?"
              />
            </div>
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              {errors.date && <span className="error">{errors.date}</span>}
            </div>
            <button type="submit" className="btn btn-primary">Submit Report</button>
          </form>
        </div>

        <div className="card list-card">
          <h2>Past Reports</h2>
          {loading ? (
            <p>Loading...</p>
          ) : reports.length === 0 ? (
            <p className="muted">No reports yet.</p>
          ) : (
            <ul className="reports-list">
              {reports.map((r) => (
                <li key={r.id}>
                  <div className="report-meta">
                    <span className="report-date">{new Date(r.date).toLocaleDateString()}</span>
                    <span className={`report-status status-${r.status.toLowerCase()}`}>{r.status}</span>
                  </div>
                  <p className="report-desc">{r.description}</p>
                  {r.location && <p className="report-loc">📍 {r.location}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
