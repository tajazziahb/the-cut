const User = require("../models/User");
const client = require("../config/plaid");

module.exports = {
    dashboardPage: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).lean();

            // If user never connected their bank
            if (!user.plaidAccessToken) {
                return res.render("dashboard", {
                    user,
                    hasData: false,
                    orbScore: null,
                    essentialsPct: null,
                    mainPressure: null,
                    runway: null
                });
            }

            // User HAS a Plaid token → fetch accounts
            const accountsRes = await client.accountsGet({
                access_token: user.plaidAccessToken
            });

            const accounts = accountsRes.data.accounts || [];

            // If plaid returned nothing
            if (accounts.length === 0) {
                return res.render("dashboard", {
                    user,
                    hasData: false,
                    orbScore: null,
                    essentialsPct: null,
                    mainPressure: null,
                    runway: null
                });
            }

            // SAMPLE numbers (we will replace with real calculations later)
            const orbScore = 82;
            const essentialsPct = 34;
            const mainPressure = "rent";
            const runway = 45;

            return res.render("dashboard", {
                user,
                hasData: true,
                orbScore,
                essentialsPct,
                mainPressure,
                runway
            });

        } catch (err) {
            console.error("Dashboard Error:", err);
            return res.render("dashboard", {
                user: req.user,
                hasData: false,
                orbScore: null,
                essentialsPct: null,
                mainPressure: null,
                runway: null
            });
        }
    }
};
