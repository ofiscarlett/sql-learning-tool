const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/random', async (req, res) => {
  try {
    const result = await db.query('SELECT id, question_text FROM questions ORDER BY RANDOM() LIMIT 1');
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No questions found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching random question:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ✅ POST /api/questions/check-ans
router.post('/check-ans', async (req, res) => {
  const { questionId, studentAns } = req.body;

  try {
    const qResult = await db.query('SELECT correct_answer FROM questions WHERE id = $1', [questionId]);
    const correctSQL = qResult.rows[0]?.correct_answer;

    if (!correctSQL) {
      return res.status(404).json({ result: false, message: 'Correct answer not found.' });
    }

    const [studentResult, correctResult] = await Promise.all([
      db.query(studentAns),
      db.query(correctSQL),
    ]);

    const sortRows = (rows) =>
      JSON.stringify([...rows].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))));

    const isCorrect = sortRows(studentResult.rows) === sortRows(correctResult.rows);

    res.json({ result: isCorrect });
  } catch (err) {
    console.error('Error checking answer:', err);
    res.status(400).json({ result: false, message: err.message });
  }
});

module.exports = router;