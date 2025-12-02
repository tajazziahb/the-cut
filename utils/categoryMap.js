const categoryRemap = {
    "Food and Drink": "Dining Out",
    Restaurants: "Dining Out",
    "Fast Food": "Dining Out",
    Groceries: "Groceries",
    "Supermarkets and Groceries": "Groceries",
    Supermarkets: "Groceries",
    "Coffee Shop": "Dining Out",
    "Travel": "Travel",
    "Entertainment": "Entertainment",
    "Arts and Entertainment": "Entertainment",
    "Health": "Health & Medical",
    "Healthcare": "Health & Medical",
    "Medical": "Health & Medical",
    "Pharmacy": "Health & Medical",
    "Service": "Personal Care",
    Transportation: "Transportation",
    "Public Transport": "Transportation",
    Auto: "Transportation",
    "Ride Share": "Transportation",
    "Mortgage": "Rent/Mortgage",
    "Rent": "Rent/Mortgage",
    Utilities: "Utilities",
    "Phone": "Utilities",
    "Internet": "Utilities",
    "Personal Care": "Personal Care",
    "Subscriptions": "Subscriptions",
    "Streaming Service": "Subscriptions",
    "Bank Fees": "Debt Payments",
    "Loan Payments": "Debt Payments",
    "Payment": "Debt Payments",
    "Transfers": "Income · Other"
};

const essentials = [
    "rent/mortgage",
    "rent",
    "mortgage",
    "utilities",
    "insurance",
    "health & medical",
    "groceries",
    "food",
    "transportation",
    "debt payments",
    "loan",
    "childcare",
    "medical"
];

const lifestyle = [
    "dining out",
    "shopping",
    "entertainment",
    "subscriptions",
    "travel",
    "personal care",
    "beauty",
    "fun",
    "other"
];

const heuristics = [
    { test: val => val.includes("salary") || val.includes("wage"), label: "Work" },
    { test: val => val.includes("income") || val.includes("deposit"), label: "Income" },
    { test: val => val.includes("fuel") || val.includes("gas station"), label: "Transportation" },
    { test: val => val.includes("insurance"), label: "Insurance" },
    { test: val => val.includes("tuition") || val.includes("school"), label: "Other" },
    { test: val => val.includes("gift"), label: "Lifestyle" },
    { test: val => val.includes("subscription") || val.includes("spotify") || val.includes("netflix"), label: "Subscriptions" },
    { test: val => val.includes("shopping"), label: "Shopping" }
];

const titleCase = value =>
    (value || "")
        .split(" ")
        .map(word => word ? word[0].toUpperCase() + word.slice(1) : "")
        .join(" ");

function resolveCategory(label = "") {
    const cleaned = label.replace(/[_-]/g, " ").trim();
    if (!cleaned) return null;

    const direct = categoryRemap[cleaned] || categoryRemap[label];
    if (direct) return direct;

    const lower = cleaned.toLowerCase();
    const heuristic = heuristics.find(rule => rule.test(lower));
    if (heuristic) return heuristic.label;

    return titleCase(cleaned);
}

function mapPlaidCategory(plaidCategory) {
    if (!plaidCategory) return "Other";

    if (Array.isArray(plaidCategory) && plaidCategory.length > 0) {
        for (const label of plaidCategory) {
            const mapped = resolveCategory(label);
            if (mapped) return mapped;
        }
        return titleCase(plaidCategory[plaidCategory.length - 1]);
    }

    if (typeof plaidCategory === "string") {
        return resolveCategory(plaidCategory);
    }

    return "Other";
}

module.exports = {
    essentials,
    lifestyle,
    mapPlaidCategory
};
