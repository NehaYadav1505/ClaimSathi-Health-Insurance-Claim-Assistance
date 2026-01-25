const express = require("express");
// 1. Import the Google SDK
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

// 2. Initialize with your Gemini Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  const { message, language } = req.body;

  try {
    // 3. Get the model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      // Set the system instruction here
      systemInstruction: `You are a health insurance claim assistant. 
      Rules:
      1. Reply strictly in ${language}.
      2. Use short, concise sentences.
      3. Always provide answers in bullet points.
      4. Avoid long paragraphs or "fluff" text.`,
    });

    // 4. Generate content
    const result = await model.generateContent(message);
    const response = await result.response;
    
    res.json({
      reply: response.text(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Chatbot service unavailable" });
  }
});

module.exports = router;