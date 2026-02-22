/**
 * Emergency Contacts API - Add/Edit/Delete contacts (protected)
 */
const express = require('express');
const { body, param, validationResult } = require('express-validator');
const pool = require('../config/db');
const { auth } = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// GET /api/contacts - List current user's emergency contacts
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, contact_name, contact_phone, created_at FROM emergency_contacts WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/contacts - Add new emergency contact
router.post(
  '/',
  [
    body('contact_name').trim().notEmpty().withMessage('Contact name is required'),
    body('contact_phone').trim().notEmpty().withMessage('Phone is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const { contact_name, contact_phone } = req.body;
      const result = await pool.query(
        'INSERT INTO emergency_contacts (user_id, contact_name, contact_phone) VALUES ($1, $2, $3) RETURNING id, contact_name, contact_phone, created_at',
        [req.user.id, contact_name, contact_phone]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error.' });
    }
  }
);

// PUT /api/contacts/:id - Update contact
router.put(
  '/:id',
  [
    param('id').isInt(),
    body('contact_name').trim().notEmpty(),
    body('contact_phone').trim().notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const { id } = req.params;
      const { contact_name, contact_phone } = req.body;
      const result = await pool.query(
        'UPDATE emergency_contacts SET contact_name = $1, contact_phone = $2 WHERE id = $3 AND user_id = $4 RETURNING id, contact_name, contact_phone, created_at',
        [contact_name, contact_phone, id, req.user.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ message: 'Contact not found.' });
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error.' });
    }
  }
);

// DELETE /api/contacts/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM emergency_contacts WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Contact not found.' });
    res.json({ message: 'Contact deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
