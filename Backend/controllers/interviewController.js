const Interview = require("../models/Interview");
const Application = require("../models/Application");
const Job = require("../models/Job");

// Schedule Interview
exports.scheduleInterview = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const { applicantId, jobId, interviewDate, mode, location, message } =
      req.body;

    const job = await Job.findById(jobId);
    if (!job)
      return res.status(404).json({ message: "Job not found" });

    if (job.createdBy.toString() !== recruiterId)
      return res.status(403).json({ message: "Forbidden" });

    const applied = await Application.findOne({ applicantId, jobId });
    if (!applied)
      return res.status(400).json({ message: "Applicant didn't apply" });

    applied.status = "interview-scheduled";
    await applied.save();

    const interview = await Interview.create({
      jobId,
      applicantId,
      recruiterId,
      interviewDate,
      mode,
      location,
      message,
    });

    res.status(201).json({ message: "Interview scheduled", interview });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Applicant - View My Interviews
exports.getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ applicantId: req.user.id })
      .populate("jobId", "title company")
      .populate("recruiterId", "name email");

    res.json(interviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Recruiter - View Interviews for a Job
exports.getInterviewsForJob = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const { jobId } = req.params;

    const interviews = await Interview.find({ recruiterId, jobId }).populate(
      "applicantId",
      "name email atsScore"
    );

    res.json(interviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
