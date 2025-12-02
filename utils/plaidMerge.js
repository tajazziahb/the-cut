const { mapPlaidCategory } = require("./categoryMap");

module.exports = function mergeTransactions(manual, plaid) {
    const manualList = Array.isArray(manual) ? manual : [];
    const plaidList = Array.isArray(plaid) ? plaid : [];

    const normalizedManual = manualList.map(t => ({
        date: t.date,
        type: t.type,
        category: t.category || "Other",
        amount: Number(t.amount) || 0,
        note: t.note || "",
        source: "manual"
    }));

    const normalizedPlaid = plaidList.map(tx => {
        const amount = Number(tx.amount) || 0;
        const isIncome = amount < 0;

        return {
            date: tx.date,
            type: isIncome ? "income" : "expense",
            category: mapPlaidCategory(tx.category),
            amount: Math.abs(amount),
            note: tx.name || "Plaid transaction",
            source: "plaid"
        };
    });

    return [...normalizedManual, ...normalizedPlaid];
};
