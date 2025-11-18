// controllers/applicationsController.js
const Application = require('../models/applicationModel');
const Job = require('../models/jobsModel');

// Recruiter: list applications for a job (with applicant details)
const getApplicantsForJob = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.createdBy.toString() !== recruiterId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const applications = await Application.find({ jobId })
      .populate({ path: 'applicantId', select: '-password -createdAt -updatedAt' })
      .sort({ appliedAt: -1 });

    res.json({ success: true, applications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Optionally: update application status (accept/reject)
const updateApplicationStatus = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const { appId } = req.params;
    const { status } = req.body; // 'reviewed'|'accepted'|'rejected'

    const application = await Application.findById(appId).populate('jobId');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    // permission: only job creator or admin
    if (application.jobId.createdBy.toString() !== recruiterId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    application.status = status;
    await application.save();
    res.json({ message: 'Application status updated', application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getApplicantsForJob, updateApplicationStatus };
