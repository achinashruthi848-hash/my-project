/**
 * Emergency Alert API - One-click panic button, store alert & list past alerts
 */
const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const { auth } = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// POST /api/emergency - Send emergency alert (stores record)
router.post(
  '/',
  [body('location').optional().trim()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const location = req.body.location || null;
      const result = await pool.query(
        'INSERT INTO emergency_alerts (user_id, location) VALUES ($1, $2) RETURNING id, user_id, location, timestamp',
        [req.user.id, location]
      );
      const alert = result.rows[0];
      // TODO: Optional - trigger email/SMS to emergency contacts using SMTP
      res.status(201).json({
        message: 'Emergency alert sent. Help is on the way.',
        alert,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error.' });
    }
  }
);

// GET /api/emergency - List current user's past alerts
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, location, timestamp FROM emergency_alerts WHERE user_id = $1 ORDER BY timestamp DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
