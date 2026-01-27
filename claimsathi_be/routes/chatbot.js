const express = require("express");
// 1. Import the Google SDK
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

// 2. Initialize with your Gemini Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  const { message, language } = req.body;

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: `You are a health insurance claim assistant.
        Rules:
        1. Reply strictly in ${language}.
        2. Use short, concise sentences.
        3. Always provide plain text without markdown (*, _, etc.).
        4. Use clear newlines for each step or sub-step.
      `,
    });

    const result = await model.generateContent(message);
    const response = await result.response;

    // CLEAN: remove all *, _, etc.
    const cleanedText = response.text().replace(/[*_]/g, "").trim();

    res.json({ reply: cleanedText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Chatbot service unavailable" });
  }
});


module.exports = router;