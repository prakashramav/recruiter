const Admin = require("../models/Admin");
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

    const token = jwt.sign(

      { id: admin._id, role: "admin" }, // payload
      process.env.JWT_SECRET,          // secret
      { expiresIn: "7d" }              // token expiry
    );

    res.status(201).json({ message: "Admin registered", result: admin, token: token });
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
