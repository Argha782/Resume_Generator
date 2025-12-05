import dotenv from 'dotenv';
import express from 'express';
// import mongoose from 'mongoose';
import cors from 'cors';
import connectDB from './configs/db.js';
import userRouter from './routes/user.routes.js';
import resumeRouter from './routes/resume.routes.js';
import aiRouter from './routes/ai.routes.js';
// import resumeRoutes from './routes/resumeRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection
await connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
  res.send('Resume Builder API is running...');
});
app.get('/health', (req, res) => {
  res.send('Everything is fine :) ...');
});
app.use('/api/users', userRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/ai', aiRouter);

// Start Server

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});