const Job = require("../models/Job");

// Create Job
exports.createJob = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    const {
      title,
      company,
      location,
      jobType,
      category,
      stipend,
      experienceRequired,
      skillsRequired,
      description,
    } = req.body;

    if (
      !title ||
      !company ||
      !location ||
      !jobType ||
      !category ||
      !stipend ||
      !experienceRequired ||
      !skillsRequired ||
      !description
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const job = await Job.create({
      title,
      company,
      location,
      jobType,
      category,
      stipend,
      experienceRequired,
      skillsRequired,
      description,
      createdBy: recruiterId,
    });

    res.status(201).json({ message: "Job created", job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// List Recruiter's Jobs
exports.listMyJobs = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    const jobs = await Job.find({ createdBy: recruiterId }).sort({
      createdAt: -1,
    });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single job by ID (Recruiter Only)
exports.getJobById = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const { jobId } = req.params;

    // Find job
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if this recruiter created the job
    if (job.createdBy.toString() !== recruiterId) {
      return res.status(403).json({ message: "Forbidden: Not your job" });
    }

    res.json({ success: true, job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// Update Job
exports.updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    Object.assign(job, req.body);

    await job.save();

    res.json({ message: "Job updated", job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Job
exports.deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    job.isActive = false;
    await job.save();

    res.json({ message: "Job deactivated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
