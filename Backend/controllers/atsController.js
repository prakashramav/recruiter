const cloudinary = require("../config/cloudinary");
const Applicant = require("../models/applicant");
const streamifier = require("streamifier");

// Upload Resume Only
exports.uploadResumeOnly = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF file" });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto", // FIXED
          folder: "resumes",
          public_id: `resume_${userId}_${Date.now()}`
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const updated = await Applicant.findByIdAndUpdate(
      userId,
      {
        resumeUrl: uploadResult.secure_url,
        resumePublicId: uploadResult.public_id,
        isResumeUploaded: true
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Resume uploaded successfully",
      resumeUrl: updated.resumeUrl
    });

  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};
// Delete Resume
exports.deleteResume = async (req, res) => {
  try {
    const user = await Applicant.findById(req.user.id);

    if (!user.resumePublicId) {
      return res.status(400).json({ message: "No resume uploaded" });
    }

    await cloudinary.uploader.destroy(user.resumePublicId, {
      resource_type: "raw"
    });

    user.resumeUrl = null;
    user.resumePublicId = null;
    user.isResumeUploaded = false;

    await user.save();

    res.json({ success: true, message: "Resume deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete resume" });
  }
};

// Resume Status
exports.getResumeStatus = async (req, res) => {
  const user = await Applicant.findById(req.user.id);

  res.json({
    uploaded: user.isResumeUploaded,
    resumeUrl: user.resumeUrl
  });
};
