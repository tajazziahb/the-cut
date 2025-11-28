const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    userId: String,
    category: String,
    amount: Number,
    date: String
});

module.exports = mongoose.model("Transaction", TransactionSchema);

