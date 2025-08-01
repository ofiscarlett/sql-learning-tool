// ✅ app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
//const db = require('./db/db'); 
const db = require('./db/db'); 
const { use } = require('react');
const totalScoreRoutes = require('./routes/totalScore');
const questionRoutes = require('./routes/questions');
const scoreRoutes = require('./routes/score');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.set('trust proxy', 1);
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
//console.log('totalScoreRoutes:', totalScoreRoutes);
app.use('/api/score', totalScoreRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/score', require('./routes/score'));
//test database route and connection
db.query('SELECT NOW()')
  .then((res) => {
    console.log('Database connected at:', res.rows[0].now);
  })
  .catch((err) => {
    console.error('failed to connect to database:', err);
  });


// 測試路由
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// 登入 API（記得 password 是加密比對）
app.post('/api/login', async (req, res) => {
  const { studentId, password } = req.body;
  console.log('debug login', studentId, password);
  console.log('debug password from client:', password);
  try {
    const result = await db.query('SELECT * FROM students WHERE student_id = $1', [studentId]);
    console.log('dbug DB result:', result.rows);
    if (result.rows.length === 0) {
      console.log('No student ID');
      return res.status(401).json({ message: 'Invalid student ID or password' });
    }
    const bcrypt = require('bcryptjs');
    const match = await bcrypt.compare(password, result.rows[0].password);
    console.log('debug match:', match);//3
    if (!match) {
      return res.status(401).json({ message: 'Invalid student ID or password' });
    }

    res.status(200).json({ message: 'Login successful', student: result.rows[0] });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});
//add studnet for teacher
app.post('/api/addStudent', async (req, res) => {
  const { studentId, name, password } = req.body;
  const bcrypt = require('bcryptjs');

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // ✅ 移進來 try 區塊
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


app.use('/api/questions', questionRoutes);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
