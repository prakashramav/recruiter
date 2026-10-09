import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';
import { AppError } from '../utils/AppError.js';
import { calculateAtsScore } from '../utils/atsCalculator.js';
import path from 'path';

export const checkAtsScore = async (jobId, resumePath) => {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new AppError('Job not found', 404);
  }

  // Get absolute path
  const absolutePath = path.join(process.cwd(), resumePath);
  const score = await calculateAtsScore(absolutePath, job.description, job.title);
  return score;
};

export const applyForJob = async (jobId, userId, resumePath, atsScore) => {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new AppError('Job not found', 404);
  }

  const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
  if (existingApplication) {
    throw new AppError('You have already applied for this job', 400);
  }

  return await Application.create({
    job: jobId,
    applicant: userId,
    resume: resumePath,
    atsScore: atsScore || null,
  });
};

export const getMyApplications = async (userId) => {
  return await Application.find({ applicant: userId })
    .populate('job', 'title company location')
    .sort('-createdAt');
};

export const getJobApplications = async (jobId, recruiterId) => {
  const job = await Job.findOne({ _id: jobId, createdBy: recruiterId });
  if (!job) {
    throw new AppError('Job not found or you do not have permission', 404);
  }

  return await Application.find({ job: jobId })
    .populate('applicant', 'name email')
    .sort('-createdAt');
};

export const updateApplicationStatus = async (applicationId, recruiterId, status, interviewLink, interviewDate) => {
  const application = await Application.findById(applicationId).populate('job');
  
  if (!application) {
    throw new AppError('Application not found', 404);
  }

  if (application.job.createdBy.toString() !== recruiterId.toString()) {
    throw new AppError('You do not have permission to update this application', 403);
  }

  application.status = status;
  if (status === 'Shortlisted') {
    if (interviewLink !== undefined) application.interviewLink = interviewLink;
    if (interviewDate !== undefined) application.interviewDate = interviewDate;
  }
  
  await application.save();

  return application;
};

export const getRecruiterStats = async (recruiterId) => {
  const jobs = await Job.find({ createdBy: recruiterId });
  const jobIds = jobs.map((job) => job._id);

  const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });

  const statusBreakdown = await Application.aggregate([
    { $match: { job: { $in: jobIds } } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  return {
    totalJobs: jobs.length,
    totalApplications,
    statusBreakdown: statusBreakdown.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {})
  };
};
