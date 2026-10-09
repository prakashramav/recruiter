import * as applicationService from '../services/applicationService.js';
import { AppError } from '../utils/AppError.js';

export const applyForJob = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('Resume PDF is required', 400);
    }

    const resumeUrl = `/uploads/resumes/${req.file.filename}`;
    const atsScore = req.body.atsScore ? parseInt(req.body.atsScore, 10) : null;
    
    const application = await applicationService.applyForJob(req.params.jobId, req.user.id, resumeUrl, atsScore);

    res.status(201).json({
      success: true,
      data: application,
      message: 'Application submitted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const checkAtsScore = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('Resume PDF is required to check ATS score', 400);
    }

    const resumeUrl = `/uploads/resumes/${req.file.filename}`;
    const score = await applicationService.checkAtsScore(req.params.jobId, resumeUrl);

    res.status(200).json({
      success: true,
      data: { score, resumeUrl },
      message: 'ATS Score calculated',
    });
  } catch (error) {
    next(error);
  }
};

export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await applicationService.getMyApplications(req.user.id);
    res.status(200).json({
      success: true,
      data: applications,
      message: 'Applications fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getJobApplications = async (req, res, next) => {
  try {
    const applications = await applicationService.getJobApplications(req.params.jobId, req.user.id);
    res.status(200).json({
      success: true,
      data: applications,
      message: 'Job applications fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const application = await applicationService.updateApplicationStatus(
      req.params.id,
      req.user.id,
      req.body.status,
      req.body.interviewLink,
      req.body.interviewDate
    );
    res.status(200).json({
      success: true,
      data: application,
      message: 'Application status updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const stats = await applicationService.getRecruiterStats(req.user.id);
    res.status(200).json({
      success: true,
      data: stats,
      message: 'Dashboard stats fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};
