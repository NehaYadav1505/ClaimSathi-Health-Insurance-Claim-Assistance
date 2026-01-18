const mongoose = require("mongoose");

const claimFileSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },

    rawText: { type: String },

    aiAnalysis: {
      prescription: String,
      labReports: String,
      hospitalBills: String,
      policyDetails: String,
      missingInformation: String,
    },

    vector: {
      type: [Number],
      index: true, // future vector search
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClaimFile", claimFileSchema);
