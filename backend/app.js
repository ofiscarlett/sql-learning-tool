// app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const db = require('./db/db'); 
const { use } = require('react');
const totalScoreRoutes = require('./routes/totalScore');
const questionRoutes = require('./routes/questions');
const scoreRoutes = require('./routes/score');
const authRoutes = require('./routes/auth');
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
app.use('/api/score', totalScoreRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/score', require('./routes/score'));
app.use('/api/auth', authRoutes);


db.query('SELECT NOW()')
  .then((res) => {
    console.log('Database connected at:', res.rows[0].now);
  })
  .catch((err) => {
    console.error('failed to connect to database:', err);
  });


// test route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});


app.use('/api/questions', questionRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
