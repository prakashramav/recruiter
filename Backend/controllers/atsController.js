const fs = require("fs");
const pdfParse = require("pdf-parse");
const Applicant = require("../models/applicant");
const OpenAI = require("openai");
const cloudinary = require("../config/cloudinary");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.uploadResumeAndScore = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;

    // 1️⃣ Extract text from PDF BEFORE deleting
    const pdfData = await pdfParse(fs.readFileSync(filePath));
    const resumeText = pdfData.text;

    // 2️⃣ Upload PDF to Cloudinary
    const cloudinaryRes = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw",
      folder: "resumes",
      public_id: `resume_${userId}_${Date.now()}`
    });

    // 3️⃣ Delete local file (optional)
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting local file:", err);
    });

    // 4️⃣ Ask OpenAI for ATS score
    const prompt = `
      Analyze the following resume and provide:
      - ATS Score (0-100)
      - Short summary of strengths and weaknesses
      
      Resume:
      ${resumeText}
    `;

    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const output = aiRes.choices[0].message.content || "";

    let atsScore = 0;
    const scoreMatch = output.match(/(\d{1,3})/);
    if (scoreMatch) atsScore = Number(scoreMatch[1]);

    // 5️⃣ Save to DB
    const updatedApplicant = await Applicant.findByIdAndUpdate(
      userId,
      {
        resumeUrl: cloudinaryRes.secure_url,
        resumePublicId: cloudinaryRes.public_id,
        atsScore,
        atsSummary: output,
        isResumeUploaded: true,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Resume uploaded & ATS Score generated",
      data: {
        resumeUrl: cloudinaryRes.secure_url,
        atsScore,
        atsSummary: output,
        applicant: updatedApplicant,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "ATS Error", error });
  }
};