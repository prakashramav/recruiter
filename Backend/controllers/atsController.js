const cloudinary = require("../config/cloudinary");
const Applicant = require("../models/applicant");


exports.uploadResumeOnly = async (req, res) => {
  try {
    const applicantId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF file" });
    }

    // Upload resume buffer to Cloudinary (raw file)
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            folder: "resumes",
            public_id: `resume_${applicantId}_${Date.now()}`
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer); // send buffer
      });
    };

    const uploadResult = await uploadToCloudinary();

    // Save to DB
    const updatedApplicant = await Applicant.findByIdAndUpdate(
      applicantId,
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
      resumeUrl: uploadResult.secure_url,
      applicant: updatedApplicant
    });

  } catch (error) {
    console.error("Resume Upload Error:", error);
    res.status(500).json({ success: false, message: "Resume upload failed" });
  }
};

exports.recalculateATS = async (req, res) => {
  try {
    const applicantId = req.user.id;

    const applicant = await Applicant.findById(applicantId);
    if (!applicant || !applicant.resumeUrl) {
      return res.status(400).json({ message: "No resume available" });
    }

    // Download the resume from Cloudinary
    const resumeFile = await axios.get(applicant.resumeUrl, {
      responseType: "arraybuffer",
    });

    const pdfData = await pdfParse(Buffer.from(resumeFile.data));
    const resumeText = pdfData.text;

    const prompt = `
      Re-analyze the following resume and give:
      - ATS Score (0–100)
      - Strengths
      - Weaknesses
      
      Resume:
      ${resumeText}
    `;

    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const output = aiRes.choices[0].message.content;
    const scoreMatch = output.match(/(\d{1,3})/);

    const newScore = scoreMatch ? Number(scoreMatch[1]) : applicant.atsScore;

    applicant.atsScore = newScore;
    applicant.atsSummary = output;

    await applicant.save();

    res.json({
      success: true,
      atsScore: newScore,
      atsSummary: output,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "ATS recalculation failed", error });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const applicantId = req.user.id;
    const applicant = await Applicant.findById(applicantId);

    if (!applicant.resumePublicId) {
      return res.status(400).json({ message: "No resume uploaded" });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(applicant.resumePublicId, {
      resource_type: "raw"
    });

    // Reset DB values
    applicant.resumeUrl = null;
    applicant.resumePublicId = null;
    applicant.isResumeUploaded = false;
    applicant.atsScore = null;
    applicant.atsSummary = null;

    await applicant.save();

    res.json({
      success: true,
      message: "Resume deleted successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getResumeStatus = async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.user.id);

    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    res.json({
      isUploaded: applicant.isResumeUploaded,
      resumeUrl: applicant.resumeUrl,
      atsScore: applicant.atsScore,
      atsSummary: applicant.atsSummary,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.validateResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Invalid file type" });
    }

    const pdfData = await pdfParse(req.file.buffer);

    if (!pdfData.text || pdfData.text.length < 20) {
      return res.status(400).json({
        message: "Resume is empty or unreadable. Try uploading a proper PDF.",
      });
    }

    res.json({
      success: true,
      message: "Resume is valid",
      pages: pdfData.numpages,
    });

  } catch (error) {
    res.status(500).json({ message: "Validation failed", error });
  }
};

