const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/summary/:studentId', async (req, res) => {
  const { studentId } = req.params;

  try {
    const result = await db.query(
      `SELECT 
         COALESCE(SUM(a.score), 0) AS total_score,
         COALESCE(SUM(q.point_weight), 0) AS max_score,
         ROUND(
           CASE 
             WHEN SUM(q.point_weight) = 0 THEN 0
             ELSE SUM(a.score)::numeric / SUM(q.point_weight)::numeric * 100 
           END, 2
         ) AS percentage
       FROM answers a
       JOIN questions q ON a.question_id = q.id
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
