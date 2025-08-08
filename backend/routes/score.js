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

router.get('/top3-perStudent', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT s.student_id, s.name, sc.score
       FROM students s
       LEFT JOIN scores sc ON s.student_id = sc.student_id
       ORDER BY s.student_id, sc.score DESC`
    );

    const groupScores = {};

    for (let row of result.rows) {
      const { student_id, name, score } = row;
      if (!groupScores[student_id]) {
        groupScores[student_id] = { student_id, name, scores: [] };
      }
      
      if (score !== null && groupScores[student_id].scores.length < 3) {
        groupScores[student_id].scores.push(score);
      }
     // if (groupScores[student_id].scores.length < 3) {
     //   groupScores[student_id].scores.push(score);
     // }
    }

    const top3List = Object.values(groupScores).map(student => ({
      student_id: student.student_id,
      name: student.name,
      scores: student.scores.length > 0 ? student.scores : ["No score found"]
    }));
    res.status(200).json(top3List);

  } catch (err) {
    console.error('Error fetching top scores per student:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
            


module.exports = router;