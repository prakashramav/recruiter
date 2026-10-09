import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.ObjectId,
    ref: 'Job',
    required: [true, 'Application must belong to a job'],
  },
  applicant: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Application must belong to a user'],
  },
  resume: {
    type: String,
    required: [true, 'Application must have a resume URL/path'],
  },
  status: {
    type: String,
    enum: ['New', 'Reviewed', 'Shortlisted', 'Rejected', 'No Show'],
    default: 'New',
  },
  interviewLink: {
    type: String,
  },
  interviewDate: {
    type: Date,
  },
  atsScore: {
    type: Number,
    min: 0,
    max: 100,
  }
}, { timestamps: true });

// Prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export const Application = mongoose.model('Application', applicationSchema);
