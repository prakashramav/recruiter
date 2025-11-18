const mongoose = require("mongoose");
const { type } = require("os");

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: String,

  jobType: {
    type: String,
    enum: ["Full-Time", "Part-Time", "Internship", "Freelance"],
    default: "Full-Time"
  },
  category: {
    type: String,
    enum: ['Software Development', 'Data Science', 'Product Management', "Artificial Intelligence", "frontend Development", "backend Development", "DevOps", "Cybersecurity", "Cloud Computing", "Mobile Development", "UI/UX Design", "Quality Assurance", "Business Analysis", "fullstack Development" , "Machine Learning" , "Blockchain" , "Game Development" , "Data Engineering", "Network Engineering", "Java Development", "Python Development", "JavaScript Development"],
    required: true
  },
  salaryRange: {
    min: Number,
    max: Number
  },

  experienceRequired: {
    type: Number,
    required: true
  },

  skillsRequired: {
    type: [String],
    required: true
  },

  description: {
    type: String,
    required: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recruiter",
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Job", JobSchema);
