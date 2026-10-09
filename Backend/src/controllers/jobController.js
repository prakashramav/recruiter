import * as jobService from '../services/jobService.js';

export const createJob = async (req, res, next) => {
  try {
    const jobData = { ...req.body, createdBy: req.user.id };
    const job = await jobService.createJob(jobData);
    res.status(201).json({
      success: true,
      data: job,
      message: 'Job created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getJobs = async (req, res, next) => {
  try {
    const result = await jobService.getJobs(req.query);
    res.status(200).json({
      success: true,
      data: result,
      message: 'Jobs fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getJob = async (req, res, next) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    res.status(200).json({
      success: true,
      data: job,
      message: 'Job fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const job = await jobService.updateJob(req.params.id, req.user.id, req.body);
    res.status(200).json({
      success: true,
      data: job,
      message: 'Job updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    await jobService.deleteJob(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      data: null,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await jobService.getRecruiterJobs(req.user.id);
    res.status(200).json({
      success: true,
      data: jobs,
      message: 'Recruiter jobs fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};
