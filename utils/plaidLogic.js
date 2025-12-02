const plaidClient = require("../config/plaid");

function formatDate(date) {
    return date.toISOString().slice(0, 10);
}

module.exports = async function fetchPlaidTransactions(accessToken) {
    if (!accessToken) return [];

    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    try {
        const response = await plaidClient.transactionsGet({
            access_token: accessToken,
            start_date: formatDate(startDate),
            end_date: formatDate(endDate),
            options: { count: 250, offset: 0 }
        });

        return response.data.transactions || [];
    } catch (err) {
        console.error("❌ Plaid fetch error:", err);
        return [];
    }
};
