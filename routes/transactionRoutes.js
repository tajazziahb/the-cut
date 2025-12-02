const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const controller = require("../controllers/transactionController");

/*
    CRUD wiring for manual transactions (Express Router docs: https://expressjs.com/en/guide/routing.html):
    - POST /transactions/add → create manual entry.
    - POST /transactions/:id/edit → adjust existing entry.
    - POST /transactions/:id/delete → remove entry.
*/
router.post("/transactions/add", requireAuth, controller.addTransaction);
router.post("/transactions/:id/edit", requireAuth, controller.editTransaction);
router.post("/transactions/:id/delete", async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.redirect("/universe");
    } catch (err) {
        console.error("Delete error:", err);
        res.redirect("/universe");
    }
});



module.exports = router;
