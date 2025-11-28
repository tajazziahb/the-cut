const express = require("express");
const dotenv = require("dotenv");
dotenv.config();  // ← MUST BE HERE before using process.env

const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const path = require("path");


const app = express();

// connect Mongo
console.log("MONGO_URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI);

// express + ejs setup
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// session + passport
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// passport config
require("./config/passport")(passport);

// routes
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/plaidRoutes"));
app.use("/dashboard", require("./routes/dashboardRoutes"));

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
