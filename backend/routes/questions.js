const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { calculatePartialScore } = require('../routes/partialScore');

router.get('/random', async (req, res) => {
  try {
      const result = await db.query(`
      SELECT id, question_text, question_type, options, correct_option_index, correct_option_indexes
      FROM questions
      ORDER BY RANDOM() LIMIT 1
    `);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No questions found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching random question:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});
// GET /answers/:studentId
router.get('/answers/:studentId', async (req, res) => {
  const { studentId } = req.params;
  const result = await db.query(`
    SELECT a.*, q.question_text 
    FROM answers a 
    JOIN questions q ON a.question_id = q.id 
    WHERE a.student_id = $1
    ORDER BY a.created_at DESC
  `, [studentId]);
  res.json(result.rows);
});


//  POST /api/questions/check-ans
router.post('/check-ans', async (req, res) => {
  const { questionId, studentAns, studentId } = req.body;
  console.log('Received studentAns:', studentAns);
  console.log('Type of studentAns:', typeof studentAns);
  if (!questionId || studentAns === undefined || !studentId) {
    console.log('questionId:', questionId);
    console.log('studentAns:', studentAns);
    console.log('studentId:', studentId);
    return res.status(400).json({ result: false, message: 'Missing required fields.' });
  }

  try {
    const qResult = await db.query('SELECT * FROM questions WHERE id = $1', [questionId]);
    const question = qResult.rows[0];
    if (!question) return res.status(404).json({ result: false, message: 'Question not found.' });
    const { calculatePartialScore } = require('../routes/partialScore');
    let isCorrect = false;
    let score = 0;

    if (question.question_type === 'mcq') {
     //const correctOption = question.options[question.correct_option_index];
      //isCorrect =Number(studentAns) === correctOption;
      //isCorrect =Number(studentAns) === question.correct_option_index;
      const selectedIndex = Number(studentAns);
      //selectedIndex === question.correct_option_index;
      isCorrect = selectedIndex === question.correct_option_index;
      score = isCorrect ? 100 : 0;

    } else if (question.question_type === 'multi') {
      //const studentChoices = Array.isArray(studentAns) ? studentAns : JSON.parse(studentAns);
      //const correct = question.correct_option_indexes.sort().join(',');
      //const submitted = studentChoices.map(Number).sort().join(',');
      let studentChoices = [];
       if (Array.isArray(studentAns)) {
        studentChoices = studentAns;
      } else if (typeof studentAns === 'string') {
        try {
          studentChoices = JSON.parse(studentAns);
        } catch {
          return res.status(400).json({ result: false, message: 'Invalid answer format.' });
        }
      } else {
        return res.status(400).json({ result: false, message: 'Unsupported answer format.' });
      }     
      const correctArray = (question.correct_option_indexes || []).map(Number).sort();
      const studentArray = studentChoices.map(Number).sort();
      const intersection = studentArray.filter(i => correctArray.includes(i));
      const partialScore = (intersection.length / correctArray.length) * 100;
      //isCorrect = submitted === correct;
      isCorrect = JSON.stringify(studentArray) === JSON.stringify(correctArray); 
      score = Math.round(partialScore);

      //score = isCorrect ? 100 : 0;

    } else {
      return res.status(400).json({ result: false, message: 'Unsupported question type.' });
    }

    await db.query(
      `INSERT INTO answers (question_id, student_id, submitted_query, is_correct, score, submitted_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [questionId, studentId, JSON.stringify(studentAns), isCorrect, score]
    );

    res.json({ result: isCorrect, score });
  } catch (err) {
    console.error('Error checking answer:', err.message);
    res.status(500).json({ result: false, message: err.message });
  }
});

module.exports = router;