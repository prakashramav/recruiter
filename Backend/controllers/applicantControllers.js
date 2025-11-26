const { stat } = require("fs");
require("dotenv").config();
const Applicant = require("../models/applicantModel");
const Application = require('../models/applicationModel');
const Job = require("../models/jobsModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const applicantRegister = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const  existingApplicant = await Applicant.findOne({ email });
        if (existingApplicant) {
            return res.status(400).json({ msg: "Applicant already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newApplicant = new Applicant({
            name,
            email,
            password: hashedPassword
        });
        await newApplicant.save();
        res.status(201).json({ msg: "Applicant registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};

const applicantLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const applicant = await Applicant.findOne({ email });
        if (!applicant) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, applicant.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }
        const token = jwt.sign({ id: applicant._id }, process.env.Applicant_JWT_Secret, {
            expiresIn: "1d"
        });
        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
}

const getApplicantProfile = async (req, res) => {
    try {
        const applicantId = req.user.id;
        const applicant = await Applicant.findById(applicantId).select('-password');
        if (!applicant) {
            return res.status(404).json({ msg: "Applicant not found" });
        }
        res.status(200).json(applicant);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};

const updateApplicantProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const updated = await Applicant.findByIdAndUpdate(
      userId,
      { ...req.body },
      { new: true }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      updated,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const viewAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const viewRelatedJobs = async (req, res) => {
  try {
    const applicantId = req.user.id;
    const applicant = await Applicant.findById(applicantId);
    
    let filters = {};
    if(applicant.interests.length > 0){
        filters.category = { $in: applicant.interests };
    }

    if(applicant.query.category){
        filters.category = applicant.query.category;
    }

    const jobs = await Job.find(filters);
    res.status(200).json(jobs);
    } catch (error) {
    res.status(500).json({ error: error.message });

    }
};

const applyForJob = async (req, res) => {
    try{
        const applicantId = req.user.id;
        const jobId = req.params.jobId;

        const existing = await Application.findOne({applicantId, jobId})
        if(existing){
            return  res.status(400).json({ msg: "Already applied for this job" });
        }
        const newApplication = await Application.create({
            applicant: applicantId,
            job : jobId,
            status: "applied",
            appliedDate: new Date() 
        });
        await newApplication.save();
        res.status(201).json({ msg: "Job application successful" , newApplication});
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

const trackApplicationStatus = async (req, res) => {
    try{
        const applicantId = req.user.id;
        const applications = await (await Application.find({ applicantId }).populate('job')).toSorted({appliedDate: -1})
        res.status(200).json({message: "Applications fetched", applications});
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};

module.exports = { applicantRegister, applyForJob, applicantLogin,getApplicantProfile,updateApplicantProfile,viewAllJobs,viewRelatedJobs, trackApplicationStatus};


