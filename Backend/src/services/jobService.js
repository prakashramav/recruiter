import { Job } from '../models/Job.js';
import { AppError } from '../utils/AppError.js';

export const createJob = async (jobData) => {
  return await Job.create(jobData);
};

export const getJobs = async (query) => {
  const { search, role, location, employmentType, page = 1, limit = 10 } = query;
  
  const filter = {};
  if (search) filter.title = { $regex: search, $options: 'i' };
  if (role) filter.title = { $regex: role, $options: 'i' };
  if (location) filter.location = { $regex: location, $options: 'i' };
  if (employmentType) filter.employmentType = employmentType;

  const skip = (page - 1) * limit;

  const jobs = await Job.find(filter)
    .populate('createdBy', 'name email')
    .skip(skip)
    .limit(Number(limit))
    .sort('-createdAt');

  const total = await Job.countDocuments(filter);

  return { jobs, total, page: Number(page), pages: Math.ceil(total / limit) };
};

export const getJobById = async (id) => {
  const job = await Job.findById(id).populate('createdBy', 'name email');
  if (!job) {
    throw new AppError('No job found with that ID', 404);
  }
  return job;
};

export const updateJob = async (id, userId, updateData) => {
  const job = await Job.findOneAndUpdate(
    { _id: id, createdBy: userId },
    updateData,
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new AppError('No job found with that ID or you do not have permission', 404);
  }
  return job;
};

export const deleteJob = async (id, userId) => {
  const job = await Job.findOneAndDelete({ _id: id, createdBy: userId });
  if (!job) {
    throw new AppError('No job found with that ID or you do not have permission', 404);
  }
  return job;
};

export const getRecruiterJobs = async (userId) => {
  return await Job.find({ createdBy: userId }).sort('-createdAt');
};
