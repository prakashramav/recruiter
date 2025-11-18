const express = require('express');
const { applicantRegister, applicantLogin,getApplicantProfile, trackApplicationStatus,applyForJob, updateApplicantProfile, viewAllJobs, viewRelatedJobs} = require('../controllers/applicantControllers');
const {auth} = require('../middlewares/auth');
const router = express.Router();

router.post('/register', applicantRegister);
router.post('/login', applicantLogin);
router.get('/me', auth, getApplicantProfile);
router.put('/update-profile', auth , updateApplicantProfile);
router.get('/all-jobs', auth, viewAllJobs);
router.get('/related-jobs', auth, viewRelatedJobs);
router.post('/apply-job/:jobId', auth, applyForJob);
router.get('/track-applications', auth, trackApplicationStatus);

module.exports = router;

