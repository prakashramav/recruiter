const fs = require("fs");
const pdfParse = require("pdf-parse");
const Applicant = require("../models/Applicant");
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.uploadResumeAndScore = async (req, res) => {
  try {
    const applicantId = req.user.id;
    const filePath = req.file.path;

    const pdfData = await pdfParse(fs.readFileSync(filePath));
    const resumeText = pdfData.text;

    const prompt = `
      Evaluate this resume text:
      - Provide ATS Score (0–100)
      - Provide strengths and weaknesses
      Resume:
      ${resumeText}
    `;

    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const result = aiRes.choices[0].message.content;

    const scoreMatch = result.match(/\b(\d{1,3})\b/);
    const atsScore = scoreMatch ? Number(scoreMatch[1]) : 50;

    const updated = await Applicant.findByIdAndUpdate(
      applicantId,
      {
        resumeUrl: filePath,
        atsScore,
        atsSummary: result,
        isProfileComplete: true,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Resume uploaded & ATS score generated",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ message: "ATS Error", error: err.message });
  }
};
