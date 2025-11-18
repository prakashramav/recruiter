const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middlewares/auth');
const { scheduleInterview, getMyInterviews, getInterviewsForJob } = require('../controllers/interviewController');

// Recruiter schedules an interview
router.post('/schedule', auth, requireRole('recruiter'), scheduleInterview);

// Recruiter: view interviews for a job
router.get('/job/:jobId', auth, requireRole('recruiter'), getInterviewsForJob);

// Applicant: view their interviews
router.get('/my', auth, requireRole('applicant'), getMyInterviews);

module.exports = router;
