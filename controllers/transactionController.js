const Transaction = require("../models/Transaction");

module.exports = {

    addTransaction: async (req, res) => {
        try {
            await Transaction.create({
                user: req.user._id,
                type: req.body.type,
                date: req.body.date,
                amount: req.body.amount,
                category: req.body.category,
                note: req.body.note || ""
            });

            res.redirect("/universe");
        } catch (error) {
            console.error("Add Transaction Error:", error);
            res.redirect("/universe");
        }
    },

    editTransaction: async (req, res) => {
        try {
            await Transaction.findByIdAndUpdate(req.params.id, {
                type: req.body.type,
                date: req.body.date,
                amount: req.body.amount,
                category: req.body.category,
                note: req.body.note || ""
            });

            res.redirect("/universe");
        } catch (error) {
            console.error("Edit Transaction Error:", error);
            res.redirect("/universe");
        }
    },

    deleteTransaction: async (req, res) => {
        try {
            await Transaction.findByIdAndDelete(req.params.id);
            res.redirect("/universe");
        } catch (error) {
            console.error("Delete Transaction Error:", error);
            res.redirect("/universe");
        }
    }
};
