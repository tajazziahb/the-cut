const plaidClient = require("../config/plaid");
const User = require("../models/User");

exports.createLinkToken = async (req, res) => {
    try {
        const response = await plaidClient.linkTokenCreate({
            user: { client_user_id: req.user._id.toString() },
            client_name: "The Cut",
            products: ["transactions"],
            country_codes: ["US"],
            language: "en",
        });

        res.json({ link_token: response.data.link_token });

    } catch (err) {
        console.error("❌ Link token error:", err);
        res.status(500).json({ error: "Failed to create link token" });
    }
};

exports.exchangePublicToken = async (req, res) => {
    try {
        const { public_token } = req.body;

        const exchange = await plaidClient.itemPublicTokenExchange({
            public_token,
        });

        const accessToken = exchange.data.access_token;

        await User.findByIdAndUpdate(req.user._id, {
            plaidAccessToken: accessToken,
        });

        console.log("✔ Saved Plaid Access Token");
        res.json({ success: true });

    } catch (err) {
        console.error("❌ Token exchange error:", err);
        res.status(500).json({ error: "Failed to exchange public token" });
    }
};
