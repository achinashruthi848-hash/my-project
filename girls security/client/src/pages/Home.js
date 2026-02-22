import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="page home-page">
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">
            <span className="title-icon">🛡️</span>
            SheShield
          </h1>
          <p className="hero-subtitle">Girls Safety & Emergency Support System</p>
          <p className="hero-desc">
            Your safety matters. One tap to alert your trusted contacts, report incidents,
            and access safety tips—all in one place.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
            <Link to="/login" className="btn btn-secondary btn-lg">Login</Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why SheShield?</h2>
          <div className="feature-grid">
            <div className="card feature-card">
              <span className="feature-icon">🚨</span>
              <h3>Emergency Alert</h3>
              <p>One-click panic button sends your location and alert to your emergency contacts instantly.</p>
            </div>
            <div className="card feature-card">
              <span className="feature-icon">📋</span>
              <h3>Report Incidents</h3>
              <p>Document incidents with location, date, and description. Track status and history.</p>
            </div>
            <div className="card feature-card">
              <span className="feature-icon">👥</span>
              <h3>Emergency Contacts</h3>
              <p>Add and manage trusted contacts who will be notified when you need help.</p>
            </div>
            <div className="card feature-card">
              <span className="feature-icon">💡</span>
              <h3>Safety Tips</h3>
              <p>Practical tips and resources to stay safe in different situations.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Ready to stay safe?</h2>
          <p>Create your free account and add your emergency contacts today.</p>
          <Link to="/register" className="btn btn-primary btn-lg">Register Now</Link>
        </div>
      </section>
    </div>
  );
}
