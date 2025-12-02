const Recruiter = require("../models/Recruiter");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Job = require("../models/jobsModel");
const Application = require("../models/applicationModel");
const Interview = require("../models/interviewModel");


// Register Recruiter
exports.recruiterRegister = async (req, res) => {
  try {
    const { name, email, password, companyName, companyWebsite, designation } =
      req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existing = await Recruiter.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Recruiter already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const recruiter = new Recruiter({
      name,
      email,
      password: hashed,
      companyName,
      companyWebsite,
      designation,
    });

    await recruiter.save();

    const result = recruiter.toObject();
    delete result.password;

    const token = jwt.sign(
      { id: recruiter._id, role: "recruiter" }, // payload
      process.env.JWT_SECRET,           // secret
      { expiresIn: "1d" }              // token expiry
    );

    res.status(201).json({ message: "Recruiter registered", result : recruiter, token: token});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
exports.recruiterLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter)
      return res.status(400).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(password, recruiter.password);
    if (!match)
      return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: recruiter._id, role: "recruiter" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Profile
exports.getMyProfile = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.user.id).select("-password");
    if (!recruiter)
      return res.status(404).json({ msg: "Recruiter not found" });

    res.json(recruiter);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.deleteRecruiterProfile = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    // Step 1: Delete all jobs created by recruiter
    const jobs = await Job.find({ createdBy: recruiterId });

    for (let job of jobs) {
      await Application.deleteMany({ jobId: job._id });
      await Interview.deleteMany({ jobId: job._id });
    }

    await Job.deleteMany({ createdBy: recruiterId });

    // Step 2: Delete interviews created directly
    await Interview.deleteMany({ recruiterId });

    // Step 3: Delete recruiter account
    await Recruiter.findByIdAndDelete(recruiterId);

    res.json({ message: "Recruiter account deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

