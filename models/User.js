const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    manualTransactions: [
        {
            type: String,
            amount: Number,
            category: String,
            date: String,
            note: String
        }
    ],

    plaidAccessToken: { type: String, default: null },
    plaidItemId: { type: String, default: null },

    plaidTransactions: [
        {
            name: String,
            amount: Number,
            date: String,
            category: [String],
            account_id: String
        }
    ],

    lastPlaidPull: { type: Date, default: null }
});

module.exports = mongoose.model("User", UserSchema);
