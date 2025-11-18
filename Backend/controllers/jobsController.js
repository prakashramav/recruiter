const Job = require('../models/jobsModel');

const createJob = async (req, res) => {
    try{
        const recruiterId = req.user.id;
        const {title, company, location, jobType, category, salaryRange, experienceRequired, skillsRequired, description} = req.body;
        if(!title || !company || !experienceRequired || !skillsRequired || !description || !category || !jobType || !location || !salaryRange){
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const job = new Job({
            title,
            company,
            location,
            jobType : jobType || "Full-Time",
            category,
            salaryRange : salaryRange || {},
            experienceRequired,
            skillsRequired,
            description,
            createdBy: recruiterId,
            isActive: true
        });

        await job.save();
        res.status(201).json({ message: 'Job created successfully', job });
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const listMyJobs = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const query = { createdBy: recruiterId };
    if (req.query.isActive) query.isActive = req.query.isActive === 'true';

    const jobs = await Job.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(query);

    res.json({ data: jobs, meta: { total, page, limit } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateJob = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // owner check
    if (job.createdBy.toString() !== recruiterId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    Object.assign(job, req.body);
    await job.save();
    res.json({ message: 'Job updated', job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteJob = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.createdBy.toString() !== recruiterId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    job.isActive = false;
    await job.save();
    res.json({ message: 'Job deactivated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { createJob, listMyJobs, updateJob, deleteJob };