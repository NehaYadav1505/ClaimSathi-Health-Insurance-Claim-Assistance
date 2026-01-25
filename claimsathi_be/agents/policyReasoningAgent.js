

const { geminiModel } = require("../utils/llmClient");



async function policyReasoningAgent(policyText) {
  if (!policyText || policyText === "Not found") {
    return {
      coPaymentPercentage: 0,
      roomRentLimitPerDay: null,
      exclusions: [],
      waitingPeriodApplicable: false,
      notes: ["Policy details missing"]
    };
  }

  const prompt = `
You are an insurance policy reasoning agent.

Task:
Extract structured policy rules from the text below.

Rules:
- Do NOT guess.
- If a value is not mentioned, return null.
- Output ONLY valid JSON.
- No explanations.

JSON format:
{
  "coPaymentPercentage": number | null,
  "roomRentLimitPerDay": number | null,
  "exclusions": string[],
  "waitingPeriodApplicable": boolean
}

Policy Text:
${policyText}
`;

  const result = await geminiModel.invoke(prompt);
const response = result.content;


 const cleanResponse = response.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleanResponse);
  } catch (err) {
    console.error("JSON Parse Error:", err, "Raw Response:", response);
    return {
      coPaymentPercentage: null,
      roomRentLimitPerDay: null,
      exclusions: [],
      waitingPeriodApplicable: false,
      notes: ["Failed to parse policy rules after cleaning"]
    };
  }
}

module.exports = policyReasoningAgent;
