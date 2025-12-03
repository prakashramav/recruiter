const mongoose = require("mongoose");

const ApplicantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    interests: {
      type: [String],
      default: []
    },
    skills: {
      type : [String],
      default : []
    },
    resumeUrl: {
      type: String,
      default: null
    },
    isResumeUploaded: {
      type: Boolean,
      default: false
    },
    experience: { type: Number, default: 0 },

    phone: Number,
    githubUrl: String,
    linkedinUrl: String,
    portfolioUrl: String,

    appliedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
      }
    ],

    isProfileComplete: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Applicant", ApplicantSchema);
