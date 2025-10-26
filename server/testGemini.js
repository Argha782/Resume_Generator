import 'dotenv/config'; // Loads .env automatically
import ai from "./configs/ai.js";

async function testGemini() {
  try {
    const model = ai.getGenerativeModel({ model: process.env.GEMINI_MODEL });
    const result = await model.generateContent("Write a one-line professional summary for a software developer.");
    const text = await result.response.text();
    console.log("Gemini response:", text);
  } catch (err) {
    console.error("Error:", err);
  }
}

testGemini();
