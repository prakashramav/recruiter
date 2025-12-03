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
  completeApplicantProfile
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

router.post("/apply-job/:jobId", auth, checkProfile,requireRole("applicant"), applyForJob);
router.get("/track-applications", auth, requireRole("applicant"), trackApplicationStatus);

module.exports = router;
