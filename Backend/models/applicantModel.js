const mongoose = require('mongoose');
const { type } = require('os');

const ApplicantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    interests:{
        type: String,
        enum: ['Software Development', 'Data Science', 'Product Management', "Artificial Intelligence", "frontend Development", "backend Development", "DevOps", "Cybersecurity", "Cloud Computing", "Mobile Development", "UI/UX Design", "Quality Assurance", "Business Analysis", "fullstack Development" , "Machine Learning" , "Blockchain" , "Game Development" , "Data Engineering", "Network Engineering", "Java Development", "Python Development", "JavaScript Development"],
        default: []
    },
    skills: [String],
    resumeUrl : String,
    atsScore: Number,
    experience: {
        type: Number,
        default: 0
    },
    phone: String,
    githubUrl: String,
    linkedinUrl: String,
    portfolioUrl: String,
    appliedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }],
    isProfileComplete: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model('Applicant', ApplicantSchema);

