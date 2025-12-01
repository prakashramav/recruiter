const Application = require("../models/Application");
const Job = require("../models/Job");

// Get Applicants for a Recruiter's Job
exports.getApplicantsForJob = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job)
      return res.status(404).json({ message: "Job not found" });

    if (job.createdBy.toString() !== recruiterId)
      return res.status(403).json({ message: "Forbidden" });

    const apps = await Application.find({ jobId })
      .populate("applicantId", "name email skills atsScore");

    res.json({ success: true, applicants: apps });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Application Status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const { applicationId } = req.params;
    const { status } = req.body;

    const app = await Application.findById(applicationId).populate("jobId");

    if (!app) return res.status(404).json({ message: "Not found" });

    if (app.jobId.createdBy.toString() !== recruiterId)
      return res.status(403).json({ message: "Forbidden" });

    app.status = status;
    await app.save();

    res.json({ message: "Status updated", app });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
