const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { calculatePartialScore } = require('../routes/partialScore');
const dotenv = require('dotenv');
dotenv.config();

router.post('/random', async (req, res) => {
  const { excludeIds } = req.body;

  try {
    const result = await db.query(`
      SELECT id, question_text, question_type, options, correct_option_index, correct_option_indexes
      FROM questions
      WHERE NOT id = ANY($1::int[])
      ORDER BY RANDOM() LIMIT 1
    `, [excludeIds || []]);

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
      const selectedIndex = Number(studentAns);
      isCorrect = selectedIndex === question.correct_option_index;
      score = isCorrect ? 100 : 0;
    } else if (question.question_type === 'multi') {
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
      const correctSet = new Set(correctArray);
      const studentSet = new Set(studentArray);

      const correctlySelected = studentArray.filter(i => correctSet.has(i));
      const wronglySelected = studentArray.filter(i => !correctSet.has(i));
      let rawscore = correctlySelected.length - wronglySelected.length;
      rawscore = Math.max(rawscore, 0);

      const partialScore = rawscore / correctArray.length;
      const pointWeight = question.point_weight || 1;
      score = Math.round(partialScore * pointWeight * 100);  
      isCorrect = partialScore === 1; // Full credit if all correct options are selected
      console.log('correctArray:', correctArray);
      console.log('studentArray:', studentArray);
      console.log('correctlySelected:', correctlySelected);
      console.log('wronglySelected:', wronglySelected);
      console.log('rawscore:', rawscore);
      console.log('partialScore:', partialScore);
      console.log('final score:', score);
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

router.post("/createQuestion", async (req, res) => {
  const { question_text, question_type, options, correct_option_index, correct_option_indexes }
    = req.body;
    const AUTH_TOKEN = process.env.AUTH_TOKEN  || 'mysecrettoken';
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    if (token !== AUTH_TOKEN) {
      return res.status(403).json({ message: 'Unauthorized: Invalid token' });
    }

    if (!question_text || !question_type || !options || options.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // check correct answer files
    if (question_type === 'mcq' && (correct_option_index === undefined || correct_option_index < 0 || correct_option_index >= options.length)) {
      return res.status(400).json({ message: 'Missing or invalid correct_option_index for MCQ' });
    }

    if (question_type === 'multi' && (!Array.isArray(correct_option_indexes) || correct_option_indexes.length === 0)) {
      return res.status(400).json({ message: 'Missing correct_option_indexes for Multi' });
    }

  try { 
    const result = await db.query(
      `INSERT INTO questions (question_text, question_type, options, correct_option_index, correct_option_indexes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [question_text, question_type, options, correct_option_index, correct_option_indexes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating question:', err);
    res.status(500).json({ message: 'Server error' });
  } 
});


module.exports = router;