

function isEmpty(text) {
  return !text || text.trim() === "" || text === "Not found";
}

function verificationAgent(aiAnalysis) {
  const mismatches = [];
  const missingDocuments = [];
  const notes = [];

  const { prescription, labReports, hospitalBills } = aiAnalysis;

  // 1️⃣ Missing document checks
  if (isEmpty(prescription)) missingDocuments.push("Prescription");
  if (isEmpty(labReports)) missingDocuments.push("Lab Reports");
  if (isEmpty(hospitalBills)) missingDocuments.push("Hospital Bills");

  // 2️⃣ Logical mismatch checks
  if (!isEmpty(prescription) && !isEmpty(hospitalBills)) {
    if (
      prescription.toLowerCase().includes("medicine") &&
      hospitalBills.toLowerCase().includes("surgery")
    ) {
      mismatches.push(
        "Surgery billed but prescription mentions only medicines"
      );
    }
  }

  if (!isEmpty(labReports) && !isEmpty(hospitalBills)) {
    if (
      hospitalBills.toLowerCase().includes("lab") &&
      !labReports.toLowerCase().includes("test")
    ) {
      mismatches.push(
        "Lab charges present but no corresponding lab report found"
      );
    }
  }

  // 3️⃣ Final status
  let status = "VERIFIED";

  if (missingDocuments.length > 0 && mismatches.length > 0) {
    status = "FAILED";
  } else if (missingDocuments.length > 0 || mismatches.length > 0) {
    status = "PARTIALLY_VERIFIED";
  }

  // 4️⃣ Notes
  if (status !== "VERIFIED") {
    notes.push("Manual review recommended");
  }

  return {
    status,
    mismatches,
    missingDocuments,
    notes,
  };
}

module.exports = verificationAgent;
