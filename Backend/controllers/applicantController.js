const Applicant = require("../models/applicant");
const Job = require("../models/Job");
const Application = require("../models/Application");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const pdfParse = require("pdf-parse");
const OpenAI = require("openai");
const axios = require("axios");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
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
      skills,
    } = req.body;

    // Parse arrays (coming as JSON strings from frontend)
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
      skills: parsedSkills,
    };

    // If no resume uploaded, just update basic profile
    if (!req.file) {
      const updatedProfile = await Applicant.findByIdAndUpdate(
        applicantId,
        updateData,
        { new: true }
      );

      return res.json({
        success: true,
        message: "Profile updated successfully",
        profile: updatedProfile,
      });
    }

    // ✅ If resume is uploaded → parse PDF + ATS + Cloudinary

    // 1️⃣ Parse resume text from buffer
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    // 2️⃣ Get ATS score using OpenAI
    const prompt = `
      Analyze the following resume text and give:
      - ATS Score (0–100)
      - Strengths
      - Weaknesses
      Resume:
      ${resumeText}
    `;

    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const output = aiRes.choices[0].message.content || "";
    const scoreMatch = output.match(/(\d{1,3})/);
    const atsScore = scoreMatch ? Number(scoreMatch[1]) : 0;

    // 3️⃣ Upload resume PDF buffer to Cloudinary (raw)
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "raw", folder: "resumes" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    updateData = {
      ...updateData,
      resumeUrl: uploadResult.secure_url,
      resumePublicId: uploadResult.public_id,
      atsScore,
      atsSummary: output,
      isResumeUploaded: true,
      isProfileComplete: true,
    };

    const updatedProfile = await Applicant.findByIdAndUpdate(
      applicantId,
      updateData,
      { new: true }
    );

    return res.json({
      success: true,
      message: "Profile & resume updated successfully",
      profile: updatedProfile,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
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
      githubUrl,
      linkedinUrl = "",
      portfolioUrl = "",
      skills,
      interests,
      experience = 0
    } = req.body;

    const formattedSkills = Array.isArray(skills)
  ? skills.filter(s => s.trim() !== "")
  : [];

    if (!phone || !skills || formattedSkills.length === 0) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const updatedProfile = await Applicant.findByIdAndUpdate(
      applicantId,
      {
        phone,
        githubUrl,
        linkedinUrl,
        portfolioUrl,
        skills,
        interests,
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

exports.deleteResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Applicant.findById(userId);

    if (!user.resumeUrl)
      return res.status(400).json({ message: "No resume found" });

    await cloudinary.uploader.destroy(user.resumePublicId, {
      resource_type: "raw"
    });

    user.resumeUrl = null;
    user.resumePublicId = null;
    user.atsScore = null;
    user.atsSummary = null;
    user.isResumeUploaded = false;

    await user.save();

    res.json({ message: "Resume deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.reScoreResume = async (req, res) => {
  try {
    const applicantId = req.user.id;

    const user = await Applicant.findById(applicantId);
    if (!user) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    if (!user.resumeUrl) {
      return res.status(400).json({
        message: "Please upload your resume before re-scoring"
      });
    }

    // 1️⃣ Download PDF from Cloudinary
    const pdfResponse = await axios.get(user.resumeUrl, {
      responseType: "arraybuffer",
    });

    // 2️⃣ Extract text from PDF
    const pdfData = await pdfParse(pdfResponse.data);
    const resumeText = pdfData.text;

    // 3️⃣ Ask OpenAI for ATS Score
    const prompt = `
      Analyze this resume:
      - Give ATS Score (0–100)
      - Strengths
      - Weaknesses

      Resume:
      ${resumeText}
    `;

    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const output = aiRes.choices[0].message.content || "";
    const scoreMatch = output.match(/(\d{1,3})/);
    const atsScore = scoreMatch ? Number(scoreMatch[1]) : 0;

    // 4️⃣ Save results
    user.atsScore = atsScore;
    user.atsSummary = output;
    await user.save();

    res.json({
      success: true,
      message: "ATS Score recalculated successfully",
      atsScore,
      summary: output,
    });

  } catch (err) {
    console.error("Error in reScoreResume:", err);
    res.status(500).json({ message: "Server error", error: err.message });
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
