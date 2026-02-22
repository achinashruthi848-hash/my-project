import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;
    try {
      const res = await api.post('/api/auth/login', form);
      login(res.data.user, res.data.token);
      navigate(from, { replace: true });
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="page auth-page">
      <div className="container auth-container">
        <div className="card auth-card">
          <h1>Login</h1>
          <p className="auth-sub">Welcome back to SheShield.</p>
          {submitError && <div className="alert alert-danger">{submitError}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Your password"
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>
            <button type="submit" className="btn btn-primary btn-block">Login</button>
          </form>
          <p className="auth-footer">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
