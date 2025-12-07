// routes/recruiterRoutes.js
const express = require("express");
const router = express.Router();

const {
  recruiterRegister,
  recruiterLogin,
  getMyProfile,
  updateRecruiterProfile,
  deleteRecruiterProfile,
  getAllInterviewsByRecruiter,
  getRecruiterAnalytics,
} = require("../controllers/recruiterController");

const {
  createJob,
  listMyJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecruiterJobsCount,
  toggleJobStatus
} = require("../controllers/jobsController");

const {
  getApplicantsForJob,
  updateApplicationStatus
} = require("../controllers/applicationsController");

const { auth, requireRole } = require("../middlewares/auth");

// Public
router.post("/register", recruiterRegister);
router.post("/login", recruiterLogin);

// Protected
router.get("/profile", auth, requireRole("recruiter"), getMyProfile);

router.post("/jobs", auth, requireRole("recruiter"), createJob);
router.get("/jobs", auth, requireRole("recruiter"), listMyJobs);
router.put("/jobs/:jobId", auth, requireRole("recruiter"), updateJob);
router.delete("/jobs/:jobId", auth, requireRole("recruiter"), deleteJob);

router.put("/update-profile", auth, requireRole("recruiter"), updateRecruiterProfile);
router.delete("/delete-profile", auth, requireRole("recruiter"), deleteRecruiterProfile);

router.get("/jobs/:jobId/applicants", auth, requireRole("recruiter"), getApplicantsForJob);
router.get("/jobs/:jobId", auth, requireRole("recruiter"), getJobById);
router.put("/jobs/:id/toggle", auth, requireRole("recruiter"), toggleJobStatus);


router.get("/all", auth, requireRole("recruiter"), getAllInterviewsByRecruiter);
router.put("/applications/:applicationId/status", auth, requireRole("recruiter"), updateApplicationStatus);
router.get("/jobs-count", auth, requireRole("recruiter"), getRecruiterJobsCount);
router.get("/analytics", auth, requireRole("recruiter"), getRecruiterAnalytics);

module.exports = router;
