const express = require("express");
const router = express.Router();

const {
  analyzeClaim
} = require("../controllers/claimAnalysisController");

router.post("/analyze/:claimId", analyzeClaim);

module.exports = router;
