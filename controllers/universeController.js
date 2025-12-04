const User = require("../models/User");
const Transaction = require("../models/Transaction");
const fetchPlaidTransactions = require("../utils/plaidLogic");
const mergeTransactions = require("../utils/plaidMerge");
const categoriesMap = require("../utils/categoryMap");

module.exports = {
    /*
        
        1. Pull manual + Plaid transactions for the authed user.
        2. Merge streams, compute income vs. expenses, and derive donut data.
        3. Build insights + stats, then render the Universe dashboard.
    */
    universePage: async (req, res) => {
        try {
            const user = await User.findById(req.user._id);

            const manualTx = await Transaction.find({ user: req.user._id });

            let plaidTx = [];
            if (user.plaidAccessToken) {
                plaidTx = await fetchPlaidTransactions(user.plaidAccessToken);
            }
            plaidTx = Array.isArray(plaidTx) ? plaidTx : [];

            // Obtain merged transaction list
            const allTx = mergeTransactions(manualTx, plaidTx);

            const income = allTx.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0);
            const expense = allTx.filter(t => t.type === "expense").reduce((a, b) => a + b.amount, 0);

            // Breathing Room % = ((Income - Expense) / Income) * 100
            let br = 0;
            if (income > 0) br = ((income - expense) / income) * 100;
            br = Math.max(0, Math.min(100, br));

            // Prepare donut chart data
            const grouped = {};
            allTx.forEach(t => {
                const label =
                    t.type === "income"
                        ? `Income · ${t.category || "Other"}`
                        : t.category || "Other";

                grouped[label] = (grouped[label] || 0) + Number(t.amount);
            });

            // Construct ringData for charting
            const ringData = {
                labels: Object.keys(grouped),
                values: Object.values(grouped)
            };

            const essentialsSet = new Set(categoriesMap.essentials.map(c => c.toLowerCase()));

            const essentialSpent = allTx
                .filter(t => t.type === "expense" && essentialsSet.has((t.category || "").toLowerCase()))
                .reduce((sum, tx) => sum + Number(tx.amount), 0);

            const lifestyleSpent = allTx
                .filter(t => {
                    const cat = (t.category || "").toLowerCase();
                    return t.type === "expense" && !essentialsSet.has(cat); 
                })
                .reduce((sum, tx) => sum + Number(tx.amount), 0);

            const topCategory = Object.entries(grouped)
                .sort((a, b) => b[1] - a[1])[0];

            const insights = [];
            if (topCategory) {
                insights.push(`Most energy is flowing to ${topCategory[0]} this month.`);
            }
            insights.push(
                `Manual entries: ${manualTx.length}`,
                `Plaid transactions synced: ${plaidTx.length}`
            );
            if (user.lastPlaidPull) {
                insights.push(`Last Plaid refresh: ${user.lastPlaidPull.toLocaleDateString()}`);
            } else {
                insights.push("Connect Plaid to keep your orbit updated.");
            }

            res.render("universe", {
                user,
                manualTx,
                plaidTx,
                ringData,
                breathingRoomPercent: br,
                stats: {
                    totalIncome: income,
                    totalExpense: expense,
                    essentialSpent,
                    lifestyleSpent,
                    lastPlaidPull: user.lastPlaidPull
                },
                insights
            });

        } catch (err) {
            console.log("Universe Page Error", err);
            res.redirect("/login");
        }
    },

    addManualTx: async (req, res) => {
        try {
            const { date, type, category, amount, note } = req.body;

            // Normalize date with explicit UTC time to avoid timezone drift (MDN Date.parse: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse).
            const normalizedDate = date ? new Date(`${date}T12:00:00Z`) : new Date();

            await Transaction.create({
                user: req.user._id,
                date: normalizedDate,
                type,
                category,
                amount: Number(amount),
                note
            });

            res.redirect("/universe");
        } catch (err) {
            console.log("Add Error:", err);
            res.redirect("/universe");
        }
    },

    updateManualTx: async (req, res) => {
        try {
            const { date, type, category, amount, note } = req.body;

            // Same timezone guard as addManualTx to keep persisted dates stable (MDN Date.parse: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse).
            const normalizedDate = date ? new Date(`${date}T12:00:00Z`) : new Date();

            await Transaction.findOneAndUpdate(
                { _id: req.params.id, user: req.user._id },
                {
                    date: normalizedDate,
                    type,
                    category,
                    amount: Number(amount),
                    note
                }
            );

            res.redirect("/universe");
        } catch (err) {
            console.log("Update Error:", err);
            res.redirect("/universe");
        }
    },

    deleteManualTx: async (req, res) => {
        try {
            await Transaction.findOneAndDelete({
                _id: req.params.id,
                user: req.user._id
            });

            res.redirect("/universe");
        } catch (err) {
            console.log("Delete Error:", err);
            res.redirect("/universe");
        }
    }
};
