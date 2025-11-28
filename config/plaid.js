// config/plaid.js
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

const config = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
            "PLAID-SECRET": process.env.PLAID_SECRET
        }
    }
});

module.exports = new PlaidApi(config);
