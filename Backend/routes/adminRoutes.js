const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middlewares/auth');

const {
  registerAdmin,
  loginAdmin,
  getAllApplicants,
  getAllRecruiters,
  deleteApplicant,
  deleteRecruiter,
  getAllJobs,
  getAllApplications,
  getAllInterviews
} = require('../controllers/adminController');

// Public
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Protected routes (admin only)
router.use(auth, requireRole('admin'));

// Applicants
router.get('/applicants', getAllApplicants);
router.delete('/applicants/:applicantId', deleteApplicant);

// Recruiters
router.get('/recruiters', getAllRecruiters);
router.delete('/recruiters/:recruiterId', deleteRecruiter);

// Jobs & Applications
router.get('/jobs', getAllJobs);
router.get('/applications', getAllApplications);
router.get('/interviews', getAllInterviews);

module.exports = router;
