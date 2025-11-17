const mongoose = require('mongoose');

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
    skills: [String],
    resumeUrl : String,
    atsScore: Number,
    experience: {
        type: Number,
        default: 0
    },
    phone: String,
    appliedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', ApplicantSchema);

