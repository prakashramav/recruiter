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
      .populate("applicantId", "name email skills resumeUrl");

    res.json({ success: true, applicants: apps });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Application Status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    //  If interview already scheduled, block rejecting
    if (application.status === "accepted" && (status === "reviewed" || status === "rejected")) {
      return res.status(400).json({
        message: "Cannot modify status after acceptance"
      });
    }


    // Update status normally
    application.status = status;
    await application.save();

    res.json({ success: true, updatedStatus: status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};