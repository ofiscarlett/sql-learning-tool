// backend/app.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const port = process.env.PORT ;

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

//test route 
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
