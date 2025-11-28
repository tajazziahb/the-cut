const express = require("express");
const router = express.Router();
const plaidController = require("../controllers/plaidController");
const { ensureAuth } = require("../middleware/auth");

// Create link token
router.get("/plaid/create-link-token", ensureAuth, plaidController.createLinkToken);

// Exchange public token
router.post("/plaid/exchange-token", ensureAuth, plaidController.exchangeToken);

module.exports = router;
