// Orchestration of multiple agents

const ClaimFile = require("../Models/document_tbl");

// Agents
const verificationAgent = require("../agents/verificationAgent");
const policyReasoningAgent = require("../agents/policyReasoningAgent");
const eligibilityAgent = require("../agents/eligibilityAgent");
const deductionAgent = require("../agents/deductionAgent");
const riskAgent = require("../agents/riskAgent");

async function analyzeClaim(req, res) {
  try {
    const { claimId } = req.params;

    // 1️⃣ Fetch claim from DB
    const claim = await ClaimFile.findById(claimId);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    const aiAnalysis = claim.aiAnalysis;

    // 2️⃣ Verification Agent
    const verificationResult = verificationAgent(aiAnalysis);

    // 3️⃣ Policy Reasoning Agent (LLM)
    const policyRules = await policyReasoningAgent(
      aiAnalysis.policyDetails
    );

    // 4️⃣ Build claimData (derived, not stored)
    const claimData = {
      roomRentPerDay: 5000,        // temporary assumption
      hospitalDays: 4,             // temporary assumption
      billItems: [
        { name: "Room Rent", amount: 20000 },
        { name: "Doctor Fees", amount: 3000 },
        { name: "Consumables", amount: 1500 }
      ]
    };

    // 5️⃣ Eligibility Agent
    const eligibilityResult = eligibilityAgent(
      policyRules,
      claimData
    );

    // 6️⃣ Deduction Agent
    const deductionResult = deductionAgent(
      policyRules,
      claimData,
      eligibilityResult
    );

    // 7️⃣ Risk Assessment Agent
    const riskResult = riskAgent(
      verificationResult,
      eligibilityResult,
      deductionResult
    );

    // 8️⃣ Final response
    return res.status(200).json({
      success: true,
      claimId: claim._id,
      verification: verificationResult,
      policyRules,
      eligibility: eligibilityResult,
      deductions: deductionResult,
      riskAssessment: riskResult,
    });
  } catch (error) {
    console.error("❌ Claim Analysis Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

module.exports = { analyzeClaim };
