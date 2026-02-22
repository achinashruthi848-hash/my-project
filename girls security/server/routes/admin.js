/**
 * Admin API - Monitor users and reports (admin only)
 */
const express = require('express');
const pool = require('../config/db');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();
router.use(auth);
router.use(adminOnly);

// GET /api/admin/users - List all users
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/admin/reports - List all incident reports (with user info)
router.get('/reports', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.id, r.user_id, u.name as user_name, u.email, r.description, r.location, r.date, r.status, r.created_at
       FROM incident_reports r
       JOIN users u ON r.user_id = u.id
       ORDER BY r.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/admin/reports/:id/status - Update report status (Pending/Resolved)
router.put('/reports/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['Pending', 'Resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }
    const result = await pool.query(
      'UPDATE incident_reports SET status = $1 WHERE id = $2 RETURNING id, status',
      [status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Report not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/admin/alerts - List all emergency alerts (for analytics)
router.get('/alerts', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.id, a.user_id, u.name, u.email, a.location, a.timestamp
       FROM emergency_alerts a
       JOIN users u ON a.user_id = u.id
       ORDER BY a.timestamp DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/admin/stats - Dashboard stats (counts for charts)
router.get('/stats', async (req, res) => {
  try {
    const [users, reports, alerts] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM users'),
      pool.query('SELECT COUNT(*) as count FROM incident_reports'),
      pool.query('SELECT COUNT(*) as count FROM emergency_alerts'),
    ]);
    res.json({
      users: parseInt(users.rows[0].count, 10),
      reports: parseInt(reports.rows[0].count, 10),
      alerts: parseInt(alerts.rows[0].count, 10),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
