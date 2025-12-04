const express = require("express");
const router = express.Router();

const {
  scheduleInterview,
  getMyInterviews,
  getInterviewsForJob,
  getUpcomingInterviews
} = require("../controllers/interviewController");

const { auth, requireRole } = require("../middlewares/auth");

// Recruiter schedules interview
router.post("/schedule", auth, requireRole("recruiter"), scheduleInterview);

// Applicant checks own interviews
router.get("/my", auth, requireRole("applicant"), getMyInterviews);
router.get("/upcoming-interviews", auth, requireRole("recruiter"), getUpcomingInterviews);


// Recruiter views interviews for a job
router.get("/job/:jobId", auth, requireRole("recruiter"), getInterviewsForJob);

module.exports = router;
