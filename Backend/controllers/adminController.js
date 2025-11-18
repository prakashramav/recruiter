const Admin = require('../models/adminModel');
const Applicant = require('../models/applicantModel');
const Recruiter = require('../models/recruiterModel');
const Job = require('../models/jobsModel');
const Application = require('../models/applicationModel');
const Interview = require('../models/interviewModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// -------------------- Auth --------------------

// Register Admin
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Admin already exists' });

    const hashed = await bcrypt.hash(password, 10);

    const admin = new Admin({ name, email, password: hashed });
    await admin.save();

    const result = admin.toObject();
    delete result.password;

    res.status(201).json({ message: 'Admin registered', admin: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id, role: 'admin', email: admin.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// -------------------- Admin Management --------------------

// View all Applicants
const getAllApplicants = async (req, res) => {
  try {
    const applicants = await Applicant.find().select('-password');
    res.json({ success: true, applicants });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// View all Recruiters
const getAllRecruiters = async (req, res) => {
  try {
    const recruiters = await Recruiter.find().select('-password');
    res.json({ success: true, recruiters });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete any Applicant
const deleteApplicant = async (req, res) => {
  try {
    const { applicantId } = req.params;
    await Applicant.findByIdAndDelete(applicantId);
    res.json({ message: 'Applicant deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete any Recruiter
const deleteRecruiter = async (req, res) => {
  try {
    const { recruiterId } = req.params;
    await Recruiter.findByIdAndDelete(recruiterId);
    res.json({ message: 'Recruiter deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// View all Jobs
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('createdBy', 'name email');
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// View all Applications
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('applicantId', 'name email')
      .populate('jobId', 'title company');
    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// View all Interviews
const getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find()
      .populate('applicantId', 'name email')
      .populate('jobId', 'title company')
      .populate('recruiterId', 'name email');
    res.json({ success: true, interviews });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAllApplicants,
  getAllRecruiters,
  deleteApplicant,
  deleteRecruiter,
  getAllJobs,
  getAllApplications,
  getAllInterviews
};
