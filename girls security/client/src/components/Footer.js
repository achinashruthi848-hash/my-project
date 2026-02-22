import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="brand-icon">🛡️</span>
          SheShield – Girls Safety & Emergency Support
        </div>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/safety-tips">Safety Tips</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
        <p className="footer-copy">
          © {new Date().getFullYear()} SheShield. Stay safe.
        </p>
      </div>
    </footer>
  );
}
