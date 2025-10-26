import { GoogleGenerativeAI } from "@google/generative-ai";

const getAI = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined");
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

export default getAI