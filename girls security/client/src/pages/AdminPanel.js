import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import './Admin.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function AdminPanel() {
  const [stats, setStats] = useState({ users: 0, reports: 0, alerts: 0 });
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/api/admin/stats'),
      api.get('/api/admin/users'),
      api.get('/api/admin/reports'),
      api.get('/api/admin/alerts'),
    ])
      .then(([s, u, r, a]) => {
        setStats(s.data);
        setUsers(u.data);
        setReports(r.data);
        setAlerts(a.data);
      })
      .catch(() => alert('Failed to load admin data'))
      .finally(() => setLoading(false));
  }, []);

  const updateReportStatus = (id, status) => {
    setUpdating(id);
    api.put(`/api/admin/reports/${id}/status`, { status })
      .then(() => setReports((prev) => prev.map((r) => r.id === id ? { ...r, status } : r)))
      .catch(() => alert('Update failed'))
      .finally(() => setUpdating(null));
  };

  const barData = {
    labels: ['Users', 'Reports', 'Emergency Alerts'],
    datasets: [
      {
        label: 'Count',
        data: [stats.users, stats.reports, stats.alerts],
        backgroundColor: ['rgba(107, 33, 168, 0.7)', 'rgba(236, 72, 153, 0.7)', 'rgba(220, 38, 38, 0.7)'],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Overview' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  const doughnutData = {
    labels: ['Users', 'Reports', 'Alerts'],
    datasets: [
      {
        data: [stats.users, stats.reports, stats.alerts],
        backgroundColor: ['#6b21a8', '#ec4899', '#dc2626'],
        borderWidth: 0,
      },
    ],
  };

  if (loading) {
    return (
      <div className="page admin-page">
        <div className="container"><p>Loading admin dashboard...</p></div>
      </div>
    );
  }

  return (
    <div className="page admin-page">
      <div className="container">
        <h1 className="page-title">Admin Panel</h1>
        <p className="page-sub">Monitor users, reports, and emergency alerts.</p>

        <div className="admin-stats-cards">
          <div className="card stat-card">
            <span className="stat-value">{stats.users}</span>
            <span className="stat-label">Users</span>
          </div>
          <div className="card stat-card">
            <span className="stat-value">{stats.reports}</span>
            <span className="stat-label">Reports</span>
          </div>
          <div className="card stat-card">
            <span className="stat-value">{stats.alerts}</span>
            <span className="stat-label">Emergency Alerts</span>
          </div>
        </div>

        <div className="admin-charts">
          <div className="card chart-card">
            <Bar data={barData} options={barOptions} />
          </div>
          <div className="card chart-card chart-doughnut">
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                plugins: { title: { display: true, text: 'Distribution' } },
              }}
            />
          </div>
        </div>

        <div className="card admin-section">
          <h2>All Users</h2>
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className="badge">{u.role}</span></td>
                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card admin-section">
          <h2>Incident Reports</h2>
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id}>
                    <td>{r.user_name}<br /><small>{r.email}</small></td>
                    <td className="desc-cell">{r.description?.length > 60 ? `${r.description.slice(0, 60)}...` : r.description}</td>
                    <td>{new Date(r.date).toLocaleDateString()}</td>
                    <td><span className={`badge status-${r.status?.toLowerCase()}`}>{r.status}</span></td>
                    <td>
                      {r.status === 'Pending' ? (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          disabled={updating === r.id}
                          onClick={() => updateReportStatus(r.id, 'Resolved')}
                        >
                          {updating === r.id ? '...' : 'Mark Resolved'}
                        </button>
                      ) : (
                        <span className="muted">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card admin-section">
          <h2>Emergency Alerts</h2>
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Location</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((a) => (
                  <tr key={a.id}>
                    <td>{a.name}<br /><small>{a.email}</small></td>
                    <td>{a.location || '—'}</td>
                    <td>{new Date(a.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
