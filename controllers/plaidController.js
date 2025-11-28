// controllers/plaidController.js
const client = require("../config/plaid");
const User = require("../models/User");

module.exports = {
    createLinkToken: async (req, res) => {
        try {
            const token = await client.linkTokenCreate({
                user: { client_user_id: req.user.id.toString() },
                client_name: "Breathing Room Meter",
                products: ["transactions"],
                country_codes: ["US"],
                language: "en"
            });

            res.json({ link_token: token.data.link_token });

        } catch (err) {
            console.error("Link Token Error:", err.response?.data || err);
            res.json({ link_token: null });
        }
    },


    exchangeToken: async (req, res) => {
        try {
            const publicToken = req.body.public_token;

            const exchangeRes = await client.itemPublicTokenExchange({
                public_token: publicToken
            });

            await User.findByIdAndUpdate(req.user.id, {
                plaidAccessToken: exchangeRes.data.access_token
            });

            res.json({ success: true });

        } catch (err) {
            console.error("Exchange Token Error:", err.response?.data || err);
            res.status(500).json({ error: "public_token exchange failed" });
        }
    }
};
