const mongoose = require("mongoose");

const categories = [
  "Rent/Mortgage",
  "Utilities",
  "Groceries",
  "Transportation",
  "Insurance",
  "Debt Payments",
  "Health & Medical",
  "Dining Out",
  "Shopping",
  "Entertainment",
  "Subscriptions",
  "Travel",
  "Personal Care",
  "Work",
  "Other"
];

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  type: {
    type: String,
    enum: ["income", "expense"],
    required: true
  },

  amount: { type: Number, required: true },

  category: {
    type: String,
    enum: categories,
    required: true
  },

  note: { type: String, default: "" },

  date: { type: Date, required: true }
});

module.exports = mongoose.model("Transaction", TransactionSchema);
