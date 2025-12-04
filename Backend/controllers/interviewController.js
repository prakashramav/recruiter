const Interview = require("../models/Interview");
const Application = require("../models/Application");
const Job = require("../models/Job");

// Schedule Interview
exports.scheduleInterview = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const { applicantId, jobId, interviewDate, mode, meetLink, message } =
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
      meetLink,  // Add this
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
    const applicantId = req.user.id;

    const interviews = await Interview.find({
      applicantId,
      interviewDate: { $gte: new Date() }   // ONLY upcoming
    })
      .populate("jobId", "title company location")
      .populate("recruiterId", "name email")
      .sort({ interviewDate: 1 });

    res.json({
      success: true,
      count: interviews.length,
      interviews
    });

  } catch (err) {
    console.error("Error fetching upcoming applicant interviews:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Recruiter - View Interviews for a Job
exports.getInterviewsForJob = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const { jobId } = req.params;

    const interviews = await Interview.find({ recruiterId, jobId }).populate(
      "applicantId",
      "name email"
    );

    res.json(interviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUpcomingInterviews = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    // Get all jobs created by recruiter
    const jobs = await Job.find({ createdBy: recruiterId }).select("_id title company");

    const jobIds = jobs.map(j => j._id);

    // Fetch interviews only with future date
    const upcoming = await Interview.find({
      jobId: { $in: jobIds },
      interviewDate: { $gte: new Date() }       // Only future dates
    })
    .populate("applicantId", "name email phone skills resumeUrl")
    .populate("jobId", "title company")
    .sort({ interviewDate: 1 });                // Soonest first

    res.json({
      success: true,
      count: upcoming.length,
      interviews: upcoming
    });

  } catch (err) {
    console.error("Error fetching upcoming interviews:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
