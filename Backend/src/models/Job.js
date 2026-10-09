import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    responsibilities: [String],
    requirements: [String],
    requiredSkills: [String],
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Freelance"],
      required: true,
    },
    workMode: {
      type: String,
      enum: ["Remote", "Hybrid", "On-site"],
      required: true,
    },
    location: {
      type: String,
      trim: true,
    },
    experienceLevel: {
      type: String,
      enum: ["Fresher", "Junior", "Mid-level", "Senior", "Lead"],
      required: true,
    },
    minExperience: {
      type: Number,
      min: 0,
      default: 0,
    },
    maxExperience: {
      type: Number,
      min: 0,
    },
    salaryMin: {
      type: Number,
      min: 0,
    },
    salaryMax: {
      type: Number,
      min: 0,
    },
    salaryCurrency: {
      type: String,
      default: "INR",
    },
    openings: {
      type: Number,
      default: 1,
      min: 1,
    },
    applicationDeadline: {
      type: Date,
      required: true,
    },
    education: [String],
    benefits: [String],
    status: {
      type: String,
      enum: ["Draft", "Published", "Paused", "Closed"],
      default: "Published",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Job = mongoose.model('Job', jobSchema);
