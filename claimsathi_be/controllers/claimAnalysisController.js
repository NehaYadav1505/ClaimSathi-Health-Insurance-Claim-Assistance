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

    // 4️⃣ Build claimData dynamically from aiAnalysis
const bills = aiAnalysis.hospitalBills || {};
const billItems = bills.billItems || [];

// 1. Calculate hospital days
const admission = new Date(bills.admissionDate);
const discharge = new Date(bills.dischargeDate);
const hospitalDays = Math.ceil((discharge - admission) / (1000 * 60 * 60 * 24)) || 1;

// 2. Calculate daily room rent
const roomRentItem = billItems.find(i => i.name.toLowerCase().includes("room"));
const roomRentPerDay = roomRentItem ? (roomRentItem.amount / hospitalDays) : 0;

// 3. Sanitize bill amounts (remove commas/symbols)
const sanitizedItems = billItems.map(item => ({
  name: item.name,
  amount: typeof item.amount === 'string' ? parseFloat(item.amount.replace(/[^0-9.]/g, '')) : item.amount
}));

const claimData = {
  hospitalDays,
  roomRentPerDay,
  billItems: sanitizedItems
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
