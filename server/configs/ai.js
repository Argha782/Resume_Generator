import { GoogleGenerativeAI } from "@google/generative-ai";

// if (!process.env.GEMINI_API_KEY) {
//   console.error("❌ GEMINI_API_KEY not found in environment variables");
// }
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default ai;

// import OpenAI from "openai";

// const ai = new OpenAI({
//     apiKey: process.env.GEMINI_API_KEY,
//     baseURL: process.env.OPENAI_BASE_URL
// });

// export default ai;
