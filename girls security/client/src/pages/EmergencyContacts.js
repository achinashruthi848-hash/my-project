import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Contacts.css';

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ contact_name: '', contact_phone: '' });
  const [errors, setErrors] = useState({});

  const fetchContacts = () => {
    api.get('/api/contacts').then((res) => {
      setContacts(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.contact_name.trim()) e.contact_name = 'Name is required';
    if (!form.contact_phone.trim()) e.contact_phone = 'Phone is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const resetForm = () => {
    setForm({ contact_name: '', contact_phone: '' });
    setEditing(null);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (editing) {
      api.put(`/api/contacts/${editing.id}`, form)
        .then(() => { fetchContacts(); resetForm(); })
        .catch((err) => alert(err.response?.data?.message || 'Update failed'));
    } else {
      api.post('/api/contacts', form)
        .then(() => { fetchContacts(); resetForm(); })
        .catch((err) => alert(err.response?.data?.message || 'Add failed'));
    }
  };

  const handleEdit = (c) => {
    setEditing(c);
    setForm({ contact_name: c.contact_name, contact_phone: c.contact_phone });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Remove this emergency contact?')) return;
    api.delete(`/api/contacts/${id}`).then(() => fetchContacts()).catch(() => alert('Delete failed'));
  };

  return (
    <div className="page contacts-page">
      <div className="container">
        <h1 className="page-title">Emergency Contacts</h1>
        <p className="page-sub">Add people who will be notified when you send an emergency alert.</p>

        <div className="card form-card">
          <h2>{editing ? 'Edit Contact' : 'Add Contact'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  value={form.contact_name}
                  onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                  placeholder="Contact name"
                />
                {errors.contact_name && <span className="error">{errors.contact_name}</span>}
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={form.contact_phone}
                  onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                />
                {errors.contact_phone && <span className="error">{errors.contact_phone}</span>}
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editing ? 'Update' : 'Add'}
              </button>
              {editing && (
                <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
              )}
            </div>
          </form>
        </div>

        <div className="card list-card">
          <h2>Your Contacts</h2>
          {loading ? (
            <p>Loading...</p>
          ) : contacts.length === 0 ? (
            <p className="muted">No contacts yet. Add your trusted contacts above.</p>
          ) : (
            <ul className="contacts-list">
              {contacts.map((c) => (
                <li key={c.id}>
                  <div>
                    <strong>{c.contact_name}</strong>
                    <span className="phone">{c.contact_phone}</span>
                  </div>
                  <div className="actions">
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleEdit(c)}>Edit</button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
