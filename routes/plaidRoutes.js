const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const plaidController = require("../controllers/plaidController");

/*
    Plaid Link server endpoints (Plaid quickstart flow: https://plaid.com/docs/link/):
    - GET /create_link_token → issue Link token per user.
    - POST /exchange_public_token → swap public_token for access_token.
*/
router.get("/create_link_token", requireAuth, plaidController.createLinkToken);
router.post("/exchange_public_token", requireAuth, plaidController.exchangePublicToken);

module.exports = router;
