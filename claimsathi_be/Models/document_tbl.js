const mongoose = require("mongoose");

const claimFileSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },

    rawText: { type: String },

    // UPDATED: aiAnalysis now supports objects and arrays
    aiAnalysis: {
  prescription: { type: String },
  labReports: { type: String },
  // Mixed allows for the structured object (dates + billItems array)
  hospitalBills: { type: mongoose.Schema.Types.Mixed }, 
  policyDetails: { type: String },
  missingInformation: { type: String },
},

    vector: {
      type: [Number],
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClaimFile", claimFileSchema);