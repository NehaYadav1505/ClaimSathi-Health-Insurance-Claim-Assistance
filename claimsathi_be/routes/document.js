
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { z } = require("zod");
const pdfParse = require("pdf-parse-new");
const Tesseract = require("tesseract.js");
const { geminiModel, embeddingModel } = require("../utils/llmClient");

// const {
//   ChatGoogleGenerativeAI,
//   GoogleGenerativeAIEmbeddings,
// } = require("@langchain/google-genai");

const ClaimFile = require("../Models/document_tbl");

// ---------------- MULTER ----------------
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// ---------------- GEMINI SETUP ----------------
// const model = new ChatGoogleGenerativeAI({
//   apiKey: "AIzaSyCP5mbBWabDSCr2ipSx4emIAE3CEry_WM8",
//   model: "gemini-2.5-flash",
// });

// const embeddings = new GoogleGenerativeAIEmbeddings({
//   apiKey: "AIzaSyCP5mbBWabDSCr2ipSx4emIAE3CEry_WM8",
//   model: "text-embedding-004",
// });

// ---------------- AI OUTPUT SCHEMA ----------------
const claimSchema = z.object({
  prescription: z.string().describe("Doctor prescription details"),
  labReports: z.string().describe("Lab test details and findings"),
  hospitalBills: z.string().describe("Hospital or OP bills and charges"),
  policyDetails: z.string().describe("Insurance policy related information"),
  missingInformation: z.string().describe("Anything missing or unclear"),
});

// ---------------- HELPER: OCR FALLBACK ----------------
async function extractTextFromPDF(buffer) {
  const pdfData =
    typeof pdfParse === "function"
      ? await pdfParse(buffer)
      : await pdfParse.default(buffer);

  // If text exists, return it
  if (pdfData.text && pdfData.text.trim().length > 50) {
    return pdfData.text;
  }

  // OCR fallback
  console.log("⚠ No text found, running OCR...");

  const ocrResult = await Tesseract.recognize(buffer, "eng", {
    logger: (m) => console.log(m.status),
  });

  return ocrResult.data.text;
}

// ---------------- API ----------------
router.post(
  "/analyze-document",
  upload.single("claimDocument"),
  async (req, res) => {
    try {
      // 1️⃣ Validate file
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Merged claim PDF is required",
        });
      }

      // 2️⃣ Extract text (PDF or OCR)
      const extractedText = await extractTextFromPDF(req.file.buffer);

      if (!extractedText || extractedText.trim().length < 30) {
        throw new Error("Unable to extract readable text from document");
      }

      // 3️⃣ Gemini structured extraction
      const structuredModel = geminiModel.withStructuredOutput(claimSchema);

      const aiResult = await structuredModel.invoke(`
You are a STRICT insurance claim analyst.

Rules:
- Do NOT hallucinate.
- If information is missing, say "Not found".
- Separate prescription, lab reports, bills, and policy clearly.

Document text:
${extractedText}
      `);

      // 4️⃣ Create vector embedding
      const vector = await embeddingModel.embedQuery(extractedText);

      // 5️⃣ Save to database
      const newClaim = new ClaimFile({
        fileName: req.file.originalname,
        rawText: extractedText,
        aiAnalysis: aiResult,
        vector,
        createdAt: new Date(),
      });

      await newClaim.save();

      // 6️⃣ Response
      res.status(201).json({
        success: true,
        message: "Claim document analyzed successfully",
        claimSummary: aiResult,
      });
    } catch (error) {
      console.error("❌ Claim Analysis Error:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

module.exports = router;

