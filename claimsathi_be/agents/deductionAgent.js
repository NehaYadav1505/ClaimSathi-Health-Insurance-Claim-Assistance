

function deductionAgent(policyRules, claimData, eligibilityResult) {
  const deductions = [];
  let totalClaimed = 0;
  let totalPayable = 0;

  // 1️⃣ Calculate total claimed
  claimData.billItems.forEach(item => {
    totalClaimed += item.amount;
  });

  totalPayable = totalClaimed;

  // 2️⃣ Exclusions
  if (policyRules.exclusions?.length) {
    claimData.billItems.forEach(item => {
      policyRules.exclusions.forEach(exclusion => {
        if (item.name.toLowerCase().includes(exclusion.toLowerCase())) {
          deductions.push({
            item: item.name,
            amount: item.amount,
            reason: "Excluded by policy"
          });
          totalPayable -= item.amount;
        }
      });
    });
  }

  // 3️⃣ Room rent limit
  if (policyRules.roomRentLimitPerDay) {
    const allowedRoomRent =
      policyRules.roomRentLimitPerDay * claimData.hospitalDays;

    const actualRoomRent = claimData.billItems.find(i =>
      i.name.toLowerCase().includes("room")
    );

    if (actualRoomRent && actualRoomRent.amount > allowedRoomRent) {
      const excess = actualRoomRent.amount - allowedRoomRent;

      deductions.push({
        item: "Room Rent",
        amount: excess,
        reason: "Room rent limit exceeded"
      });

      totalPayable -= excess;
    }
  }

  // 4️⃣ Co-payment
  if (policyRules.coPaymentPercentage && eligibilityResult.status !== "NOT_ELIGIBLE") {
    const copayAmount =
      (policyRules.coPaymentPercentage / 100) * totalPayable;

    deductions.push({
      item: "Co-Payment",
      amount: copayAmount,
      reason: `${policyRules.coPaymentPercentage}% co-payment applicable`
    });

    totalPayable -= copayAmount;
  }

  // 5️⃣ Safety check
  if (totalPayable < 0) totalPayable = 0;

  return {
    totalClaimed,
    totalPayable,
    deductions,
    summary: `Out of ₹${totalClaimed}, payable amount is ₹${totalPayable} after applicable deductions.`
  };
}

module.exports = deductionAgent;
