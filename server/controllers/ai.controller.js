import Resume from "../models/resume.model.js";
import getAI from "../configs/ai.js";

// controller for enhancing a resume's professional summary
// POST: /api/ai/enhance-pro-summary
export const enhanceProSummary = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
        return res.status(400).json({ error: "User content is required" });
    }
    // Logic to enhance the professional summary using AI
    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        { role: "system", content: "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS- friendly. and only return text no options or anything else." },
        {
          role: "user",
          content: userContent,
        },
      ],
    });
    const enhhancedContent = response.choices[0].message.content;
    return res.status(200).json({enhhancedContent });
  } catch (error) {
    res.status(500).json({ error: "Failed to enhance professional summary", message: error.message });
  }
};

// controller for enhancing a resume's job description
// POST: /api/ai/enhance-job-description
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({ error: "User content is required" });
    }
    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        { role: "system", content: "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be only in 1-2 sentences also highlighting key responsibilities and acheivements. Use action verbs and quantifiable results where possible. Make it compelling and ATS- friendly. and only return text no options or anything else." },
        {
          role: "user",
          content: userContent,
        },
      ],
    });
    const enhhancedContent = response.choices[0].message.content;
    return res.status(200).json({enhhancedContent });
  } catch (error) {
    res.status(500).json({message: error.message });
  }
};

// controller for uploading a resume to the database
// POST: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userID = req.userID;
        if (!resumeText) return res.status(400).json({ error: "Missing resume text" });
    if (!userID) return res.status(401).json({ error: "User not authenticated" });

     const ai = getAI();
     // Select Gemini model (from .env)
    const model = ai.getGenerativeModel({ model: process.env.GEMINI_MODEL });

    // Define prompt
    const prompt = `
You are an expert resume parser. 
Extract structured data from the following resume and output ONLY valid JSON.

Resume text:
${resumeText}

Format your response exactly like this JSON schema:

    {
    professional_summary: { type: String, default: '' },
    skills: [{type: String}],
    personalInfo: {
        image:{ type: String, default: '' },
        full_name:{ type: String, default: '' },
        profession:{ type: String, default: '' },
        email:{ type: String, default: '' },
        phone:{ type: String, default: '' },
        location:{ type: String, default: '' },
        linkedin:{ type: String, default: '' },
        website:{ type: String, default: '' },
    },
    experience: [
        {
            company: { type: String },
            position: { type: String },
            startDate:{ type: String },
            endDate:{ type: String },
            description:{ type: String },
            is_current:{ type: Boolean }
        }
    ],
    projects: [
        {
            name: { type: String },
            type: { type: String },
            description: { type: String },
        }
    ],
    education: [
        {
            institution: { type: String },
            degree: { type: String },
            field: { type: String },
            graduation_date: { type: String },
            gpa: { type: String },
        }
    ],
    }

    `
    
    const result = await model.generateContent(prompt);

    // Get text output from AI
    const textOutput = await result.response.text();

    // Extract only JSON part (in case Gemini adds explanations)
    const jsonMatch = textOutput.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI did not return valid JSON");

    const parsedData = JSON.parse(jsonMatch[0]);

    // const newResume = new Resume({
    const newResume = await Resume.create({
      userID,
      title,
        ...parsedData,
    });
    return res.status(200).json({resumeId: newResume._id });
  } catch (error) {
    console.error("AI upload error:", error);
    res.status(500).json({ message: error.message });
  }
};
