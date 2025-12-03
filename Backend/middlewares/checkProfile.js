// middlewares/checkProfile.js
const Applicant = require("../models/applicant");

const checkProfile = async (req, res, next) => {
  const user = await Applicant.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "Applicant not found" });
  }

  if (!user.isProfileComplete) {
    return res.status(403).json({
      message: "Please complete your profile first",
    });
  }

  if (!user.isResumeUploaded) {
    return res.status(403).json({
      message: "Please upload your resume before applying for jobs",
    });
  }

  next();
};

module.exports = { checkProfile };
