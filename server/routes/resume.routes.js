import express from "express";
import protect from "../middleware/auth.middleware";
import { createResume, deleteResume, getResumeById, updateResume } from "../controllers/resume.controller";

const resumeRouter = express.Router();

resumeRouter.post('/create', protect, createResume);
resumeRouter.put('/update/:resumeId', upload.single('image'), protect, updateResume);
resumeRouter.delete('/delete/:resumeId', protect, deleteResume);
resumeRouter.get('/get/:resumeId', protect, getResumeById);
resumeRouter.get('/public/:resumeId', getResumeById); // Public route to get resume by id

export default resumeRouter;