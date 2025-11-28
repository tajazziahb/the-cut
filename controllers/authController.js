const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

module.exports = {
    signupPage: (req, res) => {
        res.render("signup");
    },

    signupUser: async (req, res) => {
        const { name, email, password } = req.body;

        // hash password
        const hashed = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashed
        });

        res.redirect("/login");
    },

    loginPage: (req, res) => {
        res.render("login");
    },

    loginUser: (req, res, next) => {
        passport.authenticate("local", {
            successRedirect: "/dashboard",
            failureRedirect: "/login"
        })(req, res, next);
    },

    logoutUser: (req, res) => {
        req.logout(() => {
            res.redirect("/");
        });
    }
};
