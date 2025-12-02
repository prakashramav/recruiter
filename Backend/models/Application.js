const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Applicant",
    required: true
  },

  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },

  resumeUrl: String,
  atsScore: Number,

  status: {
    type: String,
    enum: ["applied", "reviewed", "accepted", "rejected"],
    default: "applied"
  },

  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Application", ApplicationSchema);
