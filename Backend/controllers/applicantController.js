const Applicant = require("../models/applicant");
const Job = require("../models/Job");
const Application = require("../models/Application");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// -------------------------------------------------------------
// Register Applicant
// -------------------------------------------------------------
exports.applicantRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ msg: "All fields required" });

    const existing = await Applicant.findOne({ email });
    if (existing)
      return res.status(400).json({ msg: "Applicant already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const applicant = new Applicant({ name, email, password: hashed });
    await applicant.save();

    res.status(201).json({ msg: "Applicant registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// -------------------------------------------------------------
// Login Applicant
// -------------------------------------------------------------
exports.applicantLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const applicant = await Applicant.findOne({ email });
    if (!applicant)
      return res.status(400).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(password, applicant.password);
    if (!match)
      return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: applicant._id, role: "applicant" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// -------------------------------------------------------------
// Get Applicant Profile
// -------------------------------------------------------------
exports.getApplicantProfile = async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.user.id).select("-password");
    if (!applicant)
      return res.status(404).json({ msg: "Applicant not found" });

    res.json(applicant);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// -------------------------------------------------------------
// Update Applicant Profile
// -------------------------------------------------------------
exports.updateApplicantProfile = async (req, res) => {
  try {
    const updated = await Applicant.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    );

    res.json({ msg: "Profile updated successfully", updated });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// -------------------------------------------------------------
// View All Active Jobs
// -------------------------------------------------------------
exports.viewAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------------------------------------------------
// View Related Jobs
// -------------------------------------------------------------
exports.viewRelatedJobs = async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.user.id);

    let filter = {};

    // Based on applicant interests
    if (applicant.interests.length > 0) {
      filter.category = { $in: applicant.interests };
    }

    // If frontend passes category filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const jobs = await Job.find(filter);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------------------------------------------------
// Apply For Job
// -------------------------------------------------------------
exports.applyForJob = async (req, res) => {
  try {
    const applicantId = req.user.id;
    const { jobId } = req.params;

    const existing = await Application.findOne({ applicantId, jobId });
    if (existing)
      return res.status(400).json({ msg: "Already applied for this job" });

    const newApp = await Application.create({
      applicantId,
      jobId,
      status: "applied",
      appliedAt: new Date()
    });

    res.json({ msg: "Application submitted", application: newApp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------------------------------------------------
// Track My Applications
// -------------------------------------------------------------
exports.trackApplicationStatus = async (req, res) => {
  try {
    const apps = await Application.find({ applicantId: req.user.id })
      .populate("jobId");

    res.json({ applications: apps });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
