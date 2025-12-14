# The Cut

The Cut is a full-stack "financial universe" that blends manual budgeting with live bank data so people can see how every decision affects their breathing room. Authenticated users land in a cinematic dashboard that merges Plaid transactions with hand-entered entries, renders a spending galaxy, and lets them experiment with lifestyle tweaks in real time.

[Link to view project](https://example.com/the-cut) _(update with production URL)_

![The Cut dashboard](docs/universe-dashboard.png)

## How It's Made

### Tech Stack
- **EJS**, **JavaScript**, and **CSS** for the home page, auth forms, and universe dashboard.
- **Node.js**, **Express**, and **express-session** powering the server plus **Passport (local strategy)** for session-based authentication.
- **MongoDB** with **Mongoose** models for users, manual transactions, and Plaid metadata.
- **Plaid Link + Plaid API** provides secure account linking and pulls the latest verified transactions.
- **Chart.js** renders the "Spending Galaxy" doughnut visualization on the client.

## How It Works
- Visitors sign up or log in; passwords are salted with `bcryptjs`, stored via Mongoose, and the session sticks through Passport middleware.
- A protected `/universe` route loads manual transactions from MongoDB and fetches the most recent Plaid data for the authenticated user.
- `utils/plaidMerge` normalizes both data sources, maps categories, and produces unified stats (income, expenses, essentials vs. lifestyle).
- The Breathing Room Orb converts those stats into a percentage, and the Life Choice Simulator buttons shift the in-memory gauge without a page reload.
- A Chart.js donut displays category weightings while inline cards surface essentials/lifestyle totals, insights, and the last Plaid refresh.
- Manual entries can be added via the sidebar form, edited inline with slide-down panels, or deleted (with confirm) directly from the table.
- The Plaid feed buttons open Link, exchange the public token, store the access token per user, and show synced activity with a "view more" toggle to keep the UI light.

## Optimizations
- Manual transaction dates are normalized with an explicit UTC noon to avoid timezone drift when saving or editing entries.
- Plaid responses are trimmed (30-day window, 250 records) to keep dashboard loads snappy while still giving recent coverage.
- Category normalization funnels Plaid's verbose labels into a curated essentials/lifestyle map which powers accurate donuts and insights.
- Merged transactions store income as positive numbers and annotate their source, simplifying reducers and visualization math.
- Doughnut and gauge components include "no data" fallbacks so the UI stays stable when a new account has zero activity.
- Long Plaid tables are collapsed after 10 rows and expanded on demand, preserving layout performance.

## Lessons Learned
- Designing around both manual and automated data sources requires a single canonical format before any charts or insights are calculated.
- Plaid's sandbox returns identical fixtures, so communicating environment limitations to users (and switching to `development` for real data) is essential for trust.
- Normalizing timezones up front prevents subtle bugs later when users edit or compare month-to-month flows.
- Guarding every data route with Passport middleware keeps the financial universe private without duplicating authorization logic.
- Giving users playful tools (like the Life Choice Simulator) increases engagement but demands clear copy so adjustments feel tangible.
