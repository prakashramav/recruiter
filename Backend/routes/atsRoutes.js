const express = require("express");
const router = express.Router();
const { auth,requireRole } = require("../middlewares/auth");
const uploadResume = require("../middlewares/uploadResume");
const { uploadResumeOnly,recalculateATS,deleteResume,getResumeStatus,validateResume } = require("../controllers/atsController");

router.post(
  "/upload-resume",
  auth,
  uploadResume.single("resume"),   // form-data key: resume
  uploadResumeOnly
);

router.get("/recalculate", auth, requireRole("applicant"), recalculateATS);

// Delete Resume
router.delete("/delete-resume", auth, requireRole("applicant"), deleteResume);

// Resume Status
router.get("/resume-status", auth, requireRole("applicant"), getResumeStatus);

// Validate Resume
router.post("/validate", auth, requireRole("applicant"), uploadResume.single("resume"), validateResume);

module.exports = router;
