const Applicant = require("../models/applicant");

exports.checkResume = async (req, res, next) => {
  const user = await Applicant.findById(req.user.id);

  if (!user.isResumeUploaded) {
    return res.status(403).json({
      message: "Please upload your resume before applying for jobs",
    });
  }

  next();
};
