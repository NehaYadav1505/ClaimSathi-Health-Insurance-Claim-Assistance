function eligibilityAgent(policyRules, claimData) {
  const result = {
    status: "ELIGIBLE", // ELIGIBLE | PARTIALLY_ELIGIBLE | NOT_ELIGIBLE

    coPayment: {
      applicable: false,
      percentage: 0
    },

    roomRent: {
      policyLimitPerDay: null,
      claimedPerDay: null,
      exceeded: false
    },

    nonPayableItems: [],
    warnings: []
  };

  // -----------------------------
  // 1. Co-payment check
  // -----------------------------
  if (
    policyRules.coPaymentPercentage &&
    policyRules.coPaymentPercentage > 0
  ) {
    result.coPayment.applicable = true;
    result.coPayment.percentage = policyRules.coPaymentPercentage;

    result.warnings.push(
      `Co-payment of ${policyRules.coPaymentPercentage}% is applicable as per policy`
    );
  }

  // -----------------------------
  // 2. Room rent limit check
  // -----------------------------
  if (policyRules.roomRentLimitPerDay && claimData.roomRentPerDay) {
    result.roomRent.policyLimitPerDay =
      policyRules.roomRentLimitPerDay;
    result.roomRent.claimedPerDay =
      claimData.roomRentPerDay;

    if (claimData.roomRentPerDay > policyRules.roomRentLimitPerDay) {
      result.roomRent.exceeded = true;
      result.status = "PARTIALLY_ELIGIBLE";

      result.warnings.push(
        `Room rent exceeds policy limit (₹${policyRules.roomRentLimitPerDay}/day)`
      );
    }
  }

  // -----------------------------
  // 3. Policy exclusions check
  // -----------------------------
  if (
    Array.isArray(policyRules.exclusions) &&
    Array.isArray(claimData.billItems)
  ) {
    claimData.billItems.forEach((item) => {
      if (policyRules.exclusions.includes(item.name)) {
        result.nonPayableItems.push(item);
        result.status = "PARTIALLY_ELIGIBLE";
      }
    });
  }

  // -----------------------------
  // 4. Final status correction
  // -----------------------------
  if (
    result.nonPayableItems.length === claimData.billItems?.length &&
    result.nonPayableItems.length > 0
  ) {
    result.status = "NOT_ELIGIBLE";
  }

  return result;
}

module.exports = eligibilityAgent;