
import { callLLM } from "../utils/llmClient.js";

export async function runEligibilityAgent(input) {
  const prompt = `
You are an insurance eligibility analysis agent.

Extract the following from the policy text:
1. Co-payment percentage (if any)
2. Room rent limit per day
3. Covered items
4. Excluded items

Policy Text:
${input.policyText}

Return JSON only in this format:
{
  "coPayment": { "exists": true/false, "percentage": number },
  "roomRentLimit": number,
  "covered": [],
  "notCovered": []
}
`;

  const aiResponse = await callLLM(prompt);
  const policyRules = JSON.parse(aiResponse);

  const riskHints = [];

  if (policyRules.coPayment.exists) {
    riskHints.push("Co-payment applicable");
  }

  if (
    input.hospitalStay &&
    policyRules.roomRentLimit &&
    input.hospitalStay.roomRentPerDay > policyRules.roomRentLimit
  ) {
    riskHints.push("Room rent limit exceeded");
  }

  return {
    eligibility: {
      coPayment: {
        ...policyRules.coPayment,
        explanation: policyRules.coPayment.exists
          ? `Policy includes a ${policyRules.coPayment.percentage}% co-payment clause`
          : "No co-payment clause found"
      },
      roomRentLimit: {
        limitPerDay: policyRules.roomRentLimit,
        isExceeded:
          input.hospitalStay?.roomRentPerDay > policyRules.roomRentLimit,
        explanation: `Policy allows ₹${policyRules.roomRentLimit}/day`
      },
      coverageFlags: {
        covered: policyRules.covered,
        notCovered: policyRules.notCovered
      }
    },
    riskHints
  };
}
