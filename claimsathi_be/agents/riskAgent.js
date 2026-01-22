

function riskAgent(verificationResult, eligibilityResult, deductionResult) {
  let riskScore = 0;
  const reasons = [];

  // 1️⃣ Verification issues
  if (verificationResult.status === "FAILED") {
    riskScore += 3;
    reasons.push("Document verification failed");
  }

  if (verificationResult.status === "PARTIALLY_VERIFIED") {
    riskScore += 2;
    reasons.push("Document mismatches or missing information");
  }

  // 2️⃣ Eligibility status
  if (eligibilityResult.status === "NOT_ELIGIBLE") {
    riskScore += 3;
    reasons.push("Claim not eligible under policy");
  }

  if (eligibilityResult.status === "PARTIALLY_ELIGIBLE") {
    riskScore += 1;
    reasons.push("Claim partially eligible");
  }

  // 3️⃣ High deductions ratio
  const deductionRatio =
    (deductionResult.totalClaimed - deductionResult.totalPayable) /
    deductionResult.totalClaimed;

  if (deductionRatio > 0.5) {
    riskScore += 2;
    reasons.push("High deduction ratio detected");
  }

  // 4️⃣ Final risk level
  let riskLevel = "LOW";
  let manualReviewRequired = false;

  if (riskScore >= 5) {
    riskLevel = "HIGH";
    manualReviewRequired = true;
  } else if (riskScore >= 3) {
    riskLevel = "MEDIUM";
    manualReviewRequired = true;
  }

  return {
    riskLevel,
    reasons,
    manualReviewRequired
  };
}

module.exports = riskAgent;
