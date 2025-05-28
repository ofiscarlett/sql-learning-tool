// ✅ app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const db = require('./db/db'); 

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// 測試路由
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// 登入 API（記得 password 是加密比對）
app.post('/api/login', async (req, res) => {
  const { studentId, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM students WHERE student_id = $1', [studentId]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid student ID or password' });
    }

    const bcrypt = require('bcryptjs');
    const match = await bcrypt.compare(password, result.rows[0].password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid student ID or password' });
    }

    res.status(200).json({ message: 'Login successful', student: result.rows[0] });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
