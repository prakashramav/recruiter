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
router.use(auth, requireRole("admin"));

router.get("/applicants", getAllApplicants);
router.delete("/applicants/:applicantId", deleteApplicant);

router.get("/recruiters", getAllRecruiters);
router.delete("/recruiters/:recruiterId", deleteRecruiter);

router.get("/jobs", getAllJobs);
router.get("/applications", getAllApplications);
router.get("/interviews", getAllInterviews);

module.exports = router;
