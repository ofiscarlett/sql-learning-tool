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

module.exports = router;