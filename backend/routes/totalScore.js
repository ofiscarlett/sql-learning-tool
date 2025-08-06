const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/summary/:studentId', async (req, res) => {
  const { studentId } = req.params;

  try {
    const result = await db.query(
      `SELECT 
         COUNT(*) AS total_questions,
         ROUND(SUM(a.score)::numeric / 100, 2) AS correct_equivalent,
         ROUND(
           SUM(a.score)::numeric / (COUNT(*) * 100) * 100, 2
         ) AS percentage
       FROM answers a
       WHERE a.student_id = $1`,
      [studentId]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error calculating total score:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
