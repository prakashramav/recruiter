const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const uploadResume = require("../middlewares/uploadResume");
const { uploadResumeAndScore } = require("../controllers/atsController");

router.post(
  "/upload-resume",
  auth,
  uploadResume.single("resume"),   // form-data key: resume
  uploadResumeAndScore
);

module.exports = router;
