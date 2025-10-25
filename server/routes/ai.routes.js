import express from 'express';
import protect from '../middleware/auth.middleware';
import { enhanceJobDescription, enhanceProSummary, uploadResume } from '../controllers/ai.controller';

const aiRouter = express.Router();

aiRouter.post('/enhancede-pro-summary', protect, enhanceProSummary);
aiRouter.post('/enhance-job-description', protect, enhanceJobDescription);
aiRouter.post('/upload-resume', protect, uploadResume);

export default aiRouter;