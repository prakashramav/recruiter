const Interview = require('../models/interviewModel');
const Application = require('../models/applicationModel');
const Job = require('../models/jobsModel');

// Schedule interview (Recruiter)
const scheduleInterview = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const { applicantId, jobId, interviewDate, mode, location, message } = req.body;

    // Check if job exists and belongs to recruiter
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.createdBy.toString() !== recruiterId) {
      return res.status(403).json({ message: 'Forbidden: Not your job' });
    }

    // Check if applicant applied to this job
    const application = await Application.findOne({ jobId, applicantId });
    if (!application) return res.status(400).json({ message: 'Applicant did not apply for this job' });

    // Create interview
    const interview = await Interview.create({
      jobId,
      applicantId,
      recruiterId,
      interviewDate,
      mode,
      location,
      message
    });

    // Optionally update application status
    application.status = 'Interview Scheduled';
    await application.save();

    res.status(201).json({ message: 'Interview scheduled', interview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Applicant: view scheduled interviews
const getMyInterviews = async (req, res) => {
  try {
    const applicantId = req.user.id;
    const interviews = await Interview.find({ applicantId })
      .populate('jobId', 'title company')
      .populate('recruiterId', 'name email');

    res.json({ success: true, interviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Recruiter: view interviews for their jobs
const getInterviewsForJob = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const jobId = req.params.jobId;

    const interviews = await Interview.find({ recruiterId, jobId })
      .populate('applicantId', 'name email atsScore');

    res.json({ success: true, interviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { scheduleInterview, getMyInterviews, getInterviewsForJob };
