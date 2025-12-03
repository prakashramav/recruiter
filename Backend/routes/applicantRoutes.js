const express = require("express");
const router = express.Router();

const uploadResume = require("../middlewares/uploadResume");



const {
  applicantRegister,
  applicantLogin,
  getApplicantProfile,
  updateApplicantProfile,
  viewAllJobs,
  viewRelatedJobs,
  applyForJob,
  trackApplicationStatus,
  completeApplicantProfile,
  deleteApplicantProfile,
  getMyApplications,
  searchJobs,
  filterJobs,
  deleteResume,
  reScoreResume
} = require("../controllers/applicantController");

const { auth, requireRole } = require("../middlewares/auth");
const {checkProfile} = require("../middlewares/checkProfile");

// Public
router.post("/register", applicantRegister);
router.post("/login", applicantLogin);

// Protected
router.get("/me", auth, requireRole("applicant"), getApplicantProfile);
router.post("/complete-profile", auth, requireRole("applicant"), completeApplicantProfile);
router.put(
  "/update-profile",
  auth,
  requireRole("applicant"),
  uploadResume.single("resume"),
  updateApplicantProfile
);

router.get("/all-jobs", auth, requireRole("applicant"), viewAllJobs);
router.get("/related-jobs", auth, requireRole("applicant"), viewRelatedJobs);
router.get('/my-applications', auth, requireRole("applicant"), getMyApplications);
router.get('/search', auth, requireRole("applicant"), searchJobs);
router.get("/filter", auth, requireRole("applicant"), filterJobs);
router.get('/resume/re-score', auth, requireRole("applicant"), uploadResume.single("resume"), reScoreResume);
router.post("/apply-job/:jobId", auth, requireRole("applicant"), checkProfile, applyForJob);
router.get("/track-applications", auth, requireRole("applicant"), trackApplicationStatus);
router.delete('/delete-profile', auth, requireRole("applicant"), deleteApplicantProfile);
router.delete('/delete-resume', auth, requireRole("applicant"), deleteResume);
module.exports = router;
