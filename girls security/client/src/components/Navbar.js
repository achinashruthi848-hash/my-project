import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-icon">🛡️</span>
          SheShield
        </Link>
        <button className="navbar-toggler" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
        <ul className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/safety-tips" onClick={() => setMenuOpen(false)}>Safety Tips</Link></li>
          <li>
            <button type="button" className="theme-toggle" onClick={() => setDarkMode((d) => !d)} aria-label="Toggle dark mode" title={darkMode ? 'Light mode' : 'Dark mode'}>
              {darkMode ? '☀️' : '🌙'}
            </button>
          </li>
          {user ? (
            <>
              <li><Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
              <li><Link to="/contacts" onClick={() => setMenuOpen(false)}>Emergency Contacts</Link></li>
              <li><Link to="/report" onClick={() => setMenuOpen(false)}>Report Incident</Link></li>
              <li><Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link></li>
              {isAdmin && (
                <li><Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link></li>
              )}
              <li className="nav-user">
                <span className="user-name">{user.name}</span>
                <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
              <li><Link to="/register" onClick={() => setMenuOpen(false)} className="btn btn-primary btn-sm">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
