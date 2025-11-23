const fs = require("fs");
const pdfParse = require("pdf-parse");
const Applicant = require("../models/applicantModel");
const OpenAI = require("openai");


const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

const uploadResumeAndScore = async (req, res) => {
  try {
    const userId = req.user.id;       
    const filePath = req.file.path;   

    
    const pdfData = await pdfParse(fs.readFileSync(filePath));
    const resumeText = pdfData.text;

    // STEP 2: Send to OpenAI for ATS Score
    const prompt = `
      Analyze the following resume text and give:
      - ATS Score (0–100)
      - Summary of strengths & weaknesses
      Resume:
      ${resumeText}
    `;

    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    const output = aiRes.choices[0].message.content;

    // Extract score using regex
    let atsScore = 0;
    const scoreMatch = output.match(/(\d{1,3})/);
    if (scoreMatch) atsScore = Number(scoreMatch[1]);

    // STEP 3: Update user in DB
    const updated = await Applicant.findByIdAndUpdate(
      userId,
      {
        resumeUrl: filePath,
        atsScore,
        atsSummary: output,
        isProfileComplete: true
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Resume uploaded & ATS Score generated!",
      data: updated
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "ATS Error", error });
  }
};

module.exports = { uploadResumeAndScore };