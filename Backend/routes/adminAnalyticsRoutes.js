const express = require("express");
const router = express.Router();

const { auth, requireRole } = require("../middlewares/auth");

const {
  getAdminStats,
  getGrowthStats,
  getRecruiterPerformance,
  getApplicantPerformance,
  getTopCategories,
  getRecentActivity
} = require("../controllers/adminAnalyticsController");

router.get("/stats", auth, requireRole("admin"), getAdminStats);
router.get("/growth", auth, requireRole("admin"), getGrowthStats);
router.get("/recruiter-performance", auth, requireRole("admin"), getRecruiterPerformance);
router.get("/applicant-performance", auth, requireRole("admin"), getApplicantPerformance);
router.get("/top-categories", auth, requireRole("admin"), getTopCategories);
router.get("/recent", auth, requireRole("admin"), getRecentActivity);

module.exports = router;
