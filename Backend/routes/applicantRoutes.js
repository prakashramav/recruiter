const express = require("express");
const router = express.Router();

const {
  applicantRegister,
  applicantLogin,
  getApplicantProfile,
  updateApplicantProfile,
  viewAllJobs,
  viewRelatedJobs,
  applyForJob,
  trackApplicationStatus
} = require("../controllers/applicantController");

const { auth, requireRole } = require("../middlewares/auth");

// Public
router.post("/register", applicantRegister);
router.post("/login", applicantLogin);

// Protected
router.get("/me", auth, requireRole("applicant"), getApplicantProfile);
router.put("/update-profile", auth, requireRole("applicant"), updateApplicantProfile);

router.get("/all-jobs", auth, requireRole("applicant"), viewAllJobs);
router.get("/related-jobs", auth, requireRole("applicant"), viewRelatedJobs);

router.post("/apply-job/:jobId", auth, requireRole("applicant"), applyForJob);
router.get("/track-applications", auth, requireRole("applicant"), trackApplicationStatus);

module.exports = router;
