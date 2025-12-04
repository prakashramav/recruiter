const express = require("express");
const router = express.Router();

const uploadResume = require("../middlewares/uploadResume");
const { auth, requireRole } = require("../middlewares/auth");

const {
  uploadResumeOnly,
  deleteResume,
  getResumeStatus
} = require("../controllers/atsController");

router.post(
  "/upload",
  auth,
  requireRole("applicant"),
  uploadResume.single("resume"),
  uploadResumeOnly
);

router.delete(
  "/delete",
  auth,
  requireRole("applicant"),
  deleteResume
);

router.get(
  "/status",
  auth,
  requireRole("applicant"),
  getResumeStatus
);

module.exports = router;
