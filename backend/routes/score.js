const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.post('/save', async (req, res) => {
    const { studentId, score } = req.body;
    if (!studentId || score === undefined) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }
    try {
        await db.query(
            'INSERT INTO scores (student_id, score, created_at) VALUES ($1, $2, now())',
            [studentId, score]
        );
        res.status(201).json({ message: 'Score saved successfully.' });
    } catch (err) {
        console.error('Error saving score:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/history/:studentId', async (req, res) => {
    const { studentId } = req.params;
  try {
    const result = await db.query(
      `SELECT s.student_id, s.name, sc.score, sc.created_at
       FROM students s
       JOIN scores sc ON s.student_id = sc.student_id
       WHERE s.student_id = $1
       ORDER BY sc.created_at DESC`,
      [studentId]
    );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching score history:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;