const express = require('express');
const router = express.Router();
const db = require('../db/db');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
dotenv.config();


router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;
  try {
    // 1. use student id 
    const studentResult = await db.query('SELECT * FROM students WHERE student_id = $1', [identifier]);
    if (studentResult.rows.length > 0) {
      const student = studentResult.rows[0];
      const match = await bcrypt.compare(password, student.password);
      if (!match) return res.status(401).json({ message: 'Invalid password' });

      return res.status(200).json({
        role: 'student',
        student: {
          student_id: student.student_id,
          name: student.name
        }
      });
    }
    // 2. check teacher
    const teacherResult = await db.query('SELECT * FROM teachers WHERE username = $1', [identifier]);
    if (teacherResult.rows.length > 0) {
      const teacher = teacherResult.rows[0];
      const match = await bcrypt.compare(password, teacher.password);
      if (!match) return res.status(401).json({ message: 'Invalid password' });
      return res.status(200).json({
        role: 'teacher',
        teacher: {
          username: teacher.username
        },
        token: process.env.AUTH_TOKEN || 'mysecrettoken'
      });
    }
    return res.status(404).json({ message: 'User not found' });
  } catch (err) {
    console.error('Unified login error:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
});
//add studnet for teacher
router.post('/addStudent', async (req, res) => {
  const { studentId, name, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); 
    await db.query(
      'INSERT INTO students (student_id, name, password) VALUES ($1, $2, $3)',
      [studentId, name, hashedPassword]
    );
    res.status(201).json({ message: 'Student added successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error adding student' });
  }
});

module.exports = router; 