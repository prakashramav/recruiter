const Admin = require("../models/admin");
const Applicant = require("../models/applicant");
const Recruiter = require("../models/Recruiter");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Interview = require("../models/Interview");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Admin Registration
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existing = await Admin.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const admin = new Admin({ name, email, password: hashed });
    await admin.save();

    const result = admin.toObject();
    delete result.password;

    res.status(201).json({ message: "Admin registered", admin: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// View all Applicants
exports.getAllApplicants = async (req, res) => {
  try {
    const applicants = await Applicant.find().select("-password");
    res.json({ success: true, applicants });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// View all Recruiters
exports.getAllRecruiters = async (req, res) => {
  try {
    const recruiters = await Recruiter.find().select("-password");
    res.json({ success: true, recruiters });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Applicant
exports.deleteApplicant = async (req, res) => {
  try {
    await Applicant.findByIdAndDelete(req.params.applicantId);
    res.json({ message: "Applicant deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Recruiter
exports.deleteRecruiter = async (req, res) => {
  try {
    await Recruiter.findByIdAndDelete(req.params.recruiterId);
    res.json({ message: "Recruiter deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// View all Jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("createdBy", "name email");
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// View all Applications
exports.getAllApplications = async (req, res) => {
  try {
    const apps = await Application.find()
      .populate("applicantId", "name email")
      .populate("jobId", "title company");

    res.json({ success: true, applications: apps });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// View all Interviews
exports.getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find()
      .populate("jobId", "title company")
      .populate("applicantId", "name email")
      .populate("recruiterId", "name email");

    res.json({ success: true, interviews });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
