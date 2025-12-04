const Applicant = require("../models/applicant");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Interview = require("../models/Interview");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

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

    const token = jwt.sign(
      { id: applicant._id, role: "applicant" }, // payload
      process.env.JWT_SECRET,          // secret
      { expiresIn: "7d" }              // token expiry
    );

    res.status(201).json({ msg: "Applicant registered successfully",result: applicant, token: token });
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
    const applicantId = req.user.id;

    const {
      name,
      email,
      experience,
      phone,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
      interests,
      skills
    } = req.body;

    const parsedInterests = interests ? JSON.parse(interests) : [];
    const parsedSkills = skills ? JSON.parse(skills) : [];

    let updateData = {
      name,
      email,
      experience,
      phone,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
      interests: parsedInterests,
      skills: parsedSkills
    };

    // -------------------------------
    // CASE 1 → No resume uploaded
    // -------------------------------
    if (!req.file) {
      const updated = await Applicant.findByIdAndUpdate(
        applicantId,
        updateData,
        { new: true }
      );

      return res.json({
        success: true,
        message: "Profile updated successfully",
        profile: updated
      });
    }

    // --------------------------------------------------------
    // CASE 2 → New resume uploaded: delete previous + upload new
    // --------------------------------------------------------
    const applicant = await Applicant.findById(applicantId);

    // 2A: Delete previous resume from Cloudinary IF exists
    if (applicant.resumePublicId) {
      await cloudinary.uploader.destroy(applicant.resumePublicId, {
        resource_type: "raw"
      });
    }

    // 2B: Upload new resume
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "resumes",
          public_id: `resume_${applicantId}_${Date.now()}`
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    updateData.resumeUrl = uploadResult.secure_url;
    updateData.resumePublicId = uploadResult.public_id;
    updateData.isResumeUploaded = true;

    const updated = await Applicant.findByIdAndUpdate(
      applicantId,
      updateData,
      { new: true }
    );

    return res.json({
      success: true,
      message: "Profile & resume updated successfully",
      profile: updated
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
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


exports.completeApplicantProfile = async (req, res) => {
  try {
    const applicantId = req.user.id;

    const {
      phone,
      githubUrl = "",
      linkedinUrl = "",
      portfolioUrl = "",
      skills,
      interests,
      experience = 0
    } = req.body;

    // Convert skills into array safely
    const formattedSkills = Array.isArray(skills)
      ? skills.filter((s) => s.trim() !== "")
      : typeof skills === "string"
      ? skills.split(",").map((s) => s.trim()).filter((s) => s !== "")
      : [];

    // Convert interests into array safely
    const formattedInterests = Array.isArray(interests)
      ? interests.filter((i) => i.trim() !== "")
      : typeof interests === "string"
      ? interests.split(",").map((i) => i.trim()).filter((i) => i !== "")
      : [];

    // Validate required fields
    if (!phone || formattedSkills.length === 0) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const updatedProfile = await Applicant.findByIdAndUpdate(
      applicantId,
      {
        phone,
        githubUrl,
        linkedinUrl,
        portfolioUrl,
        skills: formattedSkills,
        interests: formattedInterests,
        experience,
        isProfileComplete: true
      },
      { new: true }
    );

    res.json({
      message: "Profile completed successfully",
      profile: updatedProfile
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteApplicantProfile = async (req, res) => {
  try {
    const applicantId = req.user.id;

    await Application.deleteMany({ applicantId });
    await Interview.deleteMany({ applicantId });

    await Applicant.findByIdAndDelete(applicantId);

    res.json({ message: "Applicant account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
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

exports.getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ applicantId: req.user.id })
      .populate("jobId", "title company location jobType stipend");

    res.json({ success: true, applications: apps });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchJobs = async (req, res) => {
  try {
    const { keyword } = req.query;

    const jobs = await Job.find({
      isActive: true,
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { company: { $regex: keyword, $options: "i" } },
        { skillsRequired: { $regex: keyword, $options: "i" } },
      ],
    });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.filterJobs = async (req, res) => {
  try {
    const { category, experience, jobType } = req.query;

    let filter = { isActive: true };

    if (category) filter.category = category;
    if (experience) filter.experienceRequired = { $lte: Number(experience) };
    if (jobType) filter.jobType = jobType;

    const jobs = await Job.find(filter);

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
