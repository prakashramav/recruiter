const Recruiter = require("../models/Recruiter");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
      { id: admin._id, role: "recruiter" }, // payload
      process.env.JWT_SECRET,           // secret
      { expiresIn: "7d" }              // token expiry
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
