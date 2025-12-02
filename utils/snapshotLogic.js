const mergeTransactions = require("./plaidMerge");
const categories = require("./categoryMap");

function normalizeCategory(tx) {
    if (!tx) return "misc";

    if (typeof tx.category === "string") {
        return tx.category.toLowerCase();
    }

    if (Array.isArray(tx.category) && tx.category.length > 0) {
        const raw = tx.category[0].toLowerCase();

        if (raw.includes("food")) return "food";
        if (raw.includes("restaurant")) return "food";
        if (raw.includes("grocery")) return "groceries";
        if (raw.includes("rent")) return "rent";
        if (raw.includes("mortgage")) return "rent";
        if (raw.includes("utilities")) return "utilities";
        if (raw.includes("gas")) return "gas";
        if (raw.includes("transport")) return "transport";
        if (raw.includes("shopping")) return "shopping";
        if (raw.includes("personal care")) return "personal care";
        if (raw.includes("medical")) return "health";
        if (raw.includes("health")) return "health";
        if (raw.includes("travel")) return "travel";
        if (raw.includes("entertainment")) return "entertainment";
        if (raw.includes("subscription")) return "subscriptions";

        return raw;
    }

    return "misc";
}

module.exports = function createSnapshot(manualTx, plaidTx) {
    const allTx = mergeTransactions(manualTx, plaidTx);

    if (!allTx.length) {
        return {
            chartData: { labels: [], values: [], colors: [] },
            breathingRoomPercent: 0,
            breathingRoomLabel: "No Data",
            breathingRoomMessage: "Add transactions or connect your bank.",
            insights: []
        };
    }

    let income = 0;
    let essentialTotal = 0;
    let lifestyleTotal = 0;

    const categoryTotals = {};

    allTx.forEach(tx => {
        const amt = Math.abs(Number(tx.amount));
        const cat = normalizeCategory(tx);

        if (amt < 0 || tx.type === "income" || cat === "income") {
            income += amt;
            return;
        }

        const isEssential = categories.essentials.includes(cat);
        const isLifestyle = categories.lifestyle.includes(cat);

        if (isEssential) essentialTotal += amt;
        else lifestyleTotal += amt;

        categoryTotals[cat] = (categoryTotals[cat] || 0) + amt;
    });

    const effectiveExpenses =
        essentialTotal * 1.0 + lifestyleTotal * 0.6;

    const breathingRoomPercent =
        income > 0
            ? Math.max(0, Math.round(((income - effectiveExpenses) / income) * 100))
            : 0;

    let label = "Healthy";
    if (breathingRoomPercent < 70) label = "Tight";
    if (breathingRoomPercent < 40) label = "Stressed";
    if (breathingRoomPercent < 15) label = "Critical";

    const colors = [
        "#FF8A3D", "#FF6AA2", "#A47DFF", "#6DC9FF", "#FFC94A",
        "#FF5E5E", "#5AFFA0", "#C9A0FF", "#FF9D5C", "#8BD3FF"
    ];

    const labels = Object.keys(categoryTotals);
    const values = Object.values(categoryTotals);

    const insights = [];

    if (labels.length > 0) {
        insights.push(
            `Highest spending category: ${labels[values.indexOf(Math.max(...values))]}.`
        );
    }

    insights.push(`Essentials totaled $${essentialTotal.toFixed(2)}.`);

    if (lifestyleTotal > essentialTotal) {
        insights.push("Lifestyle spending exceeded essentials.");
    } else {
        insights.push("Your essential needs outweighed lifestyle expenses.");
    }

    return {
        chartData: {
            labels,
            values,
            colors: colors.slice(0, labels.length)
        },
        breathingRoomPercent,
        breathingRoomLabel: label,
        breathingRoomMessage: `You’re currently in a ${label.toLowerCase()} range.`,
        insights
    };
};
