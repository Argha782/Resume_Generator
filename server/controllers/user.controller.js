import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/resume.model.js";

const generateToken = (userID) => {
  const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

// POST: /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // if (!req.body.name || !req.body.email || !req.body.password) {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // const newUser = new User({
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id);
    newUser.password = undefined; // Hide password in response
    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
  res.send("User registered");
};

// POST: /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if(!user.comparePassword(password)){
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user._id);
    user.password = undefined; // Hide password in response
    res.status(200).json({
      message: "Logged in successfully",
      user,
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server Error",err});
  }
  res.send("User logged in");
};

// GET: /api/users/data
export const getUserById = async (req, res) => {
  try {
    const userID = req.userID;

    const user = await User.findById(userID);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    user.password = undefined; // Hide password in response
    res.status(200).json({user});
  } catch (err) {
    return res.status(500).json({message:err.message});
  };
};

// controller for getting user resume data
// GET: /api/users/resumes
export const getUserResumes = async (req, res) => {
  try {
    const userID = req.userID;
    const resumes = await Resume.find({userID})
    if (!resumes) {
      return res.status(400).json({ message: "Resume not found" });
    }
    res.status(200).json({ resumes});
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};