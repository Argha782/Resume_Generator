import OpenAI from "openai";

const ai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY || 'dummy',
    baseURL: process.env.OPENAI_BASE_URL
});

export default ai;
