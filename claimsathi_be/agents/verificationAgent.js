

function isEmpty(value) {
  // 1. Handle null or undefined values
  if (value === null || value === undefined) return true;

  // 2. If it's a string (like prescription or labReports), use trim()
  if (typeof value === "string") {
    return value.trim() === "" || value === "Not found";
  }

  // 3. If it's an object (like your new hospitalBills), check if it's empty
  if (typeof value === "object") {
    return Object.keys(value).length === 0;
  }

  return false;
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
  // 2️⃣ Logical mismatch checks
  if (!isEmpty(prescription) && !isEmpty(hospitalBills)) {
    // We convert bill items to a string to check for keywords
    const billItemsText = JSON.stringify(hospitalBills.billItems || "").toLowerCase();
    const prescriptionText = prescription.toLowerCase();

    if (
      prescriptionText.includes("medicine") &&
      billItemsText.includes("surgery")
    ) {
      mismatches.push(
        "Surgery billed but prescription mentions only medicines"
      );
    }
  }

  if (!isEmpty(labReports) && !isEmpty(hospitalBills)) {
    const billItemsText = JSON.stringify(hospitalBills.billItems || "").toLowerCase();
    
    if (
      billItemsText.includes("lab") &&
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
