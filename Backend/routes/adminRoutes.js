const express = require("express");
const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  getAllApplicants,
  getAllRecruiters,
  deleteApplicant,
  deleteRecruiter,
  getAllJobs,
  getAllApplications,
  getAllInterviews
} = require("../controllers/adminController");

const { auth, requireRole } = require("../middlewares/auth");

// Public
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Protected (Admin only)


module.exports = router;
