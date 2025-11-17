const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: String,
  experience: String,
  skillsRequired: [String],

  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recruiter",
    required: true
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Job", JobSchema);
