import express from 'express';
import * as applicationController from '../controllers/applicationController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { updateApplicationStatusSchema } from '../validators/applicationSchemas.js';
import { uploadResume } from '../middlewares/uploadMiddleware.js';

// mergeParams to allow access to jobId from jobRoutes
const router = express.Router({ mergeParams: true });

router.use(protect);

// Routes specifically for applicants
router.post(
  '/check-ats',
  restrictTo('applicant'),
  uploadResume.single('resume'),
  applicationController.checkAtsScore
);

router.post(
  '/',
  restrictTo('applicant'),
  uploadResume.single('resume'),
  applicationController.applyForJob
);
router.get('/me', restrictTo('applicant'), applicationController.getMyApplications);

// Routes specifically for recruiters
router.get('/stats', restrictTo('recruiter'), applicationController.getStats);
router.get('/', restrictTo('recruiter'), applicationController.getJobApplications);
router.patch(
  '/:id/status',
  restrictTo('recruiter'),
  validateRequest(updateApplicationStatusSchema),
  applicationController.updateApplicationStatus
);

export default router;
