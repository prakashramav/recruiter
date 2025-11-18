// import express from "express";
const express = require("express");
// import { upload } from "../middlewares/upload.js";
const  upload  = require("../middlewares/upload.js");
// import { auth} from "../middlewares/auth.js";
const  {auth}  = require("../middlewares/auth.js");
// import { uploadResumeAndScore } from "../controllers/atsController.js";
const { uploadResumeAndScore } = require("../controllers/atsController.js");
const router = express.Router();

router.post(
  "/upload-resume",
  auth,
  upload.single("resume"),
  uploadResumeAndScore
);

module.exports = router;
