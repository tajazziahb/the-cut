const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const plaidRoutes = require("./routes/plaidRoutes");

const app = express();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.log("❌ DB Error:", err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/universeRoutes"));
app.use("/", require("./routes/transactionRoutes"));
app.use("/", require("./routes/plaidRoutes"));

app.listen(3000, () => console.log("🚀 Server running at http://localhost:3000"));
