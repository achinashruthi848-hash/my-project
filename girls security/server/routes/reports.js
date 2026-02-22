/**
 * Incident Reports API - Submit and view reports (protected)
 */
const express = require('express');
const { body, param, validationResult } = require('express-validator');
const pool = require('../config/db');
const { auth } = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// GET /api/reports - List current user's incident reports
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, description, location, date, status, created_at FROM incident_reports WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/reports - Submit new incident report
router.post(
  '/',
  [
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('location').optional().trim(),
    body('date').isISO8601().withMessage('Valid date required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const { description, location, date } = req.body;
      const result = await pool.query(
        'INSERT INTO incident_reports (user_id, description, location, date, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, description, location, date, status, created_at',
        [req.user.id, description, location || null, date, 'Pending']
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error.' });
    }
  }
);

// GET /api/reports/:id - Get single report
router.get('/:id', [param('id').isInt()], async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, description, location, date, status, created_at FROM incident_reports WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Report not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
