

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
    const allowedRoomRent = policyRules.roomRentLimitPerDay * claimData.hospitalDays;

    const actualRoomRent = claimData.billItems.find(i =>
        i.name.toLowerCase().includes("room")
    );

    if (actualRoomRent && actualRoomRent.amount > allowedRoomRent) {
        const excess = actualRoomRent.amount - allowedRoomRent;

        deductions.push({
            item: "Room Rent",
            amount: excess,
            reason: `Room rent limit exceeded (Limit: ₹${policyRules.roomRentLimitPerDay}/day)`
        });

        totalPayable -= excess;

        // --- THIS IS THE PROPORTIONATE DEDUCTION BLOCK ---
        // We calculate the ratio: (Allowed Rate / Actual Rate)
        // For Asha Devi: 5000 / (25500 / 3) = 5000 / 8500 = 0.588
        const actualDailyRate = actualRoomRent.amount / claimData.hospitalDays;
        const ratio = policyRules.roomRentLimitPerDay / actualDailyRate; 
        
        claimData.billItems.forEach(item => {
            const itemName = item.name.toLowerCase();
            
            // 1. Skip the room rent item (we already handled the excess above)
            if (itemName.includes("room")) return;

            // 2. Apply ratio to Professional fees, Nursing, and RMO charges per Clause 4.1.2 
            if (itemName.includes("consultation") || itemName.includes("nursing") || itemName.includes("visit")) {
                const disallowedAmount = item.amount * (1 - ratio);
                
                deductions.push({
                    item: `${item.name} (Proportionate Deduction)`,
                    amount: Math.round(disallowedAmount),
                    reason: `Proportionate deduction: patient opted for higher room category`
                });
                totalPayable -= disallowedAmount;
            }
        });
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

  // 5️⃣ Safety check & Rounding
  if (totalPayable < 0) totalPayable = 0;
  
  const finalPayable = Math.round(totalPayable);

  return {
    totalClaimed,
    totalPayable: finalPayable,
    deductions,
    summary: `Out of ₹${totalClaimed}, payable amount is ₹${finalPayable} after applicable deductions.`
  };
}

module.exports = deductionAgent;
