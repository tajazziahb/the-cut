const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const controller = require("../controllers/universeController");

/*
    Pseudocode for each route (Express Router docs: https://expressjs.com/en/guide/routing.html):
    - GET /universe → render dashboard after auth gate.
    - POST /universe/add → persist a manual transaction.
    - POST /universe/:id/edit → update a manual transaction.
    - POST /universe/:id/delete → remove a manual transaction.
*/

router.get("/universe", requireAuth, controller.universePage);
router.post("/universe/add", requireAuth, controller.addManualTx);
router.post("/universe/:id/edit", requireAuth, controller.updateManualTx);
router.post("/universe/:id/delete", requireAuth, controller.deleteManualTx);

module.exports = router;
