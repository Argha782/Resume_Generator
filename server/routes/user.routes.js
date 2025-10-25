import express from 'express';
import { getUserById, getUserResumes, loginUser, registerUser } from '../controllers/user.controller.js';
import protect from '../middleware/auth.middleware.js';

const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser);
userRouter.get('/data',protect, getUserById);
// userRouter.put('/profile',protect, updateUserProfile);
userRouter.get('/resumes',protect, getUserResumes);
export default userRouter;