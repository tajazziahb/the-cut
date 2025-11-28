const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const dashboardController = require("../controllers/dashboardController");

router.get("/", ensureAuth, dashboardController.dashboardPage);

module.exports = router;
