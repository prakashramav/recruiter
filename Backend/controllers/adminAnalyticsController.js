const Applicant = require("../models/applicant");
const Recruiter = require("../models/Recruiter");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Interview = require("../models/Interview");

exports.getAdminStats = async (req, res) => {
  try {
    const totalApplicants = await Applicant.countDocuments();
    const totalRecruiters = await Recruiter.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const totalInterviews = await Interview.countDocuments();

    res.json({
      success: true,
      stats: {
        totalApplicants,
        totalRecruiters,
        totalJobs,
        totalApplications,
        totalInterviews,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getGrowthStats = async (req, res) => {
  try {
    const months = await Application.aggregate([
      {
        $group: {
          _id: { $month: "$appliedAt" },
          applications: { $sum: 1 },
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const jobMonths = await Job.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          jobs: { $sum: 1 },
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      success: true,
      applicationStats: months,
      jobStats: jobMonths
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRecruiterPerformance = async (req, res) => {
  try {
    const recruiters = await Recruiter.find();

    const stats = await Promise.all(
      recruiters.map(async (r) => {
        const jobs = await Job.find({ createdBy: r._id });
        const jobIds = jobs.map((j) => j._id);

        const applications = await Application.countDocuments({ jobId: { $in: jobIds } });
        const interviews = await Interview.countDocuments({ recruiterId: r._id });

        return {
          recruiter: r.name,
          email: r.email,
          totalJobs: jobs.length,
          totalApplications: applications,
          totalInterviews: interviews,
        };
      })
    );

    res.json({ success: true, stats });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getApplicantPerformance = async (req, res) => {
  try {
    const applicants = await Applicant.find();

    const stats = await Promise.all(
      applicants.map(async (a) => {
        const apps = await Application.countDocuments({ applicantId: a._id });
        const interviews = await Interview.countDocuments({ applicantId: a._id });

        return {
          name: a.name,
          email: a.email,
          applications: apps,
          interviews,
        };
      })
    );

    res.json({ success: true, stats });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTopCategories = async (req, res) => {
  try {
    const categories = await Job.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({ success: true, categories });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }).limit(10);
    const apps = await Application.find().sort({ appliedAt: -1 }).limit(10);
    const interviews = await Interview.find().sort({ createdAt: -1 }).limit(10);

    res.json({
      success: true,
      recent: {
        jobs,
        applications: apps,
        interviews
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
