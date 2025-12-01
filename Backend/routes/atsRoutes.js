const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");
const { uploadResumeAndScore } = require("../controllers/atsController");
const { auth, requireRole } = require("../middlewares/auth");

router.post(
  "/upload-resume",
  auth,
  requireRole("applicant"),
  upload.single("resume"),
  uploadResumeAndScore
);

module.exports = router;
