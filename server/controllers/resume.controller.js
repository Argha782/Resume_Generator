import imagekit from "../configs/imagekit";
import Resume from "../models/resume.model";
import fs from "fs";

// controller for creating a new resume
// POST: /api/resumes/create
export const createResume = async (req, res) => {
  try {
    const userID = req.userID;
    const { title } = req.body;

    // const newResume = new Resume({
    const newResume = await Resume.create({
      userID,
      title,
    });
    return res
      .status(201)
      .json({ message: "Resume created successfully", resume: newResume });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// controller for deleing a new resume
// DELETE: /api/resumes/delete
export const deleteResume = async (req, res) => {
  try {
    const userID = req.userID;
    const { resumeId } = req.params;

    await Resume.findOneAndDelete({
      _id: resumeId,
      userID,
    });
    return res.status(200).json({ message: "Resume deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// controller for getting resume by id
// GET: /api/resumes/get
export const getResumeById = async (req, res) => {
  try {
    const userID = req.userID;
    const { resumeId } = req.body;

    const resume = await Resume.findOne({
      _id: resumeId,
      userID,
    });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    resume.__v = undefined; // Hide __v in response
    resume.createdAt = undefined; // Hide createdAt in response
    resume.updatedAt = undefined; // Hide updatedAt in response

    return res.status(200).json({ resume });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// controller for getting resume by id public
// GET: /api/resumes/public
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.body;

    const resume = await Resume.findOne({
      public: true,
      _id: resumeId,
    });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ resume });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// controller for updating a new resume
// PUT: /api/resumes/update
export const updateResume = async (req, res) => {
  try {
    const userID = req.userID;
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;

    let resumeDataCopy = JSON.parse(resumeData);

    if (image) {
      const imageBufferData = fs.createReadStream(image.path)
      const response = await imagekit.files.upload({
        file: imageBufferData,
        fileName: "resume.png",
        folder:'user-resumes',
        transformation:{
          pre:'w-300, h-300, fo-face, z-0.75' + (removeBackground ? ', e-bgremoval' : '')
        }
      });
      resumeDataCopy.personalInfo.image = response.url;
    }
    const resume = await Resume.findByIdAndUpdate(
      {
        _id: resumeId,
        userID,
      },
      resumeDataCopy,
      { new: true }
    );
    return res.status(200).json({ message: "Saved successfully", resume });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
