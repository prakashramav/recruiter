import express from 'express';
import * as jobController from '../controllers/jobController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createJobSchema, updateJobSchema } from '../validators/jobSchemas.js';
import applicationRoutes from './applicationRoutes.js';

const router = express.Router();

// Nested route for applications on a specific job
router.use('/:jobId/applications', applicationRoutes);

router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJob);

// Protected recruiter routes
router.use(protect);
router.use(restrictTo('recruiter'));

router.get('/me/jobs', jobController.getMyJobs);
router.post('/', validateRequest(createJobSchema), jobController.createJob);
router.put('/:id', validateRequest(updateJobSchema), jobController.updateJob);
router.delete('/:id', jobController.deleteJob);

export default router;
