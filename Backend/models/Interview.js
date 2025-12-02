const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Applicant', required: true },
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },

  interviewDate: { type: Date, required: true },
  mode: { type: String, enum: ['Online', 'Offline'], default: 'Online' },
  location: String, // for offline
  message: String, // optional notes from recruiter

  status: { type: String, enum: ['Scheduled','Completed','Cancelled'], default: 'Scheduled' },
}, { timestamps: true });

module.exports = mongoose.model('Interview', InterviewSchema);
