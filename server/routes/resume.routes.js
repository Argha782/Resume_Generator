import express from "express";
import protect from "../middleware/auth.middleware.js";
import { createResume, deleteResume, getResumeById, getPublicResumeById, updateResume } from "../controllers/resume.controller.js";
import upload from "../configs/multer.js";

const resumeRouter = express.Router();

resumeRouter.post('/create', protect, createResume);
resumeRouter.put('/update/:resumeId', upload.single('image'), protect, updateResume);
resumeRouter.delete('/delete/:resumeId', protect, deleteResume);
resumeRouter.get('/get/:resumeId', protect, getResumeById);
resumeRouter.get('/public/:resumeId', getPublicResumeById); // Public route to get resume by id

export default resumeRouter;