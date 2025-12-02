const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

module.exports = {
    signupPage: (req, res) => {
        res.render("signup");
    },

    signupUser: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            const existing = await User.findOne({ email });
            if (existing) {
                return res.render("signup", { error: "Email already in use" });
            }

            const hashed = await bcrypt.hash(password, 10);

            await User.create({
                name,
                email,
                password: hashed
            });

            res.redirect("/login");
        } catch (err) {
            console.log(err);
            res.render("signup", { error: "Something went wrong" });
        }
    },

    loginPage: (req, res) => {
        res.render("login");
    },

    loginUser: (req, res, next) => {
        passport.authenticate("local", {
            successRedirect: "/universe",
            failureRedirect: "/login"
        })(req, res, next);
    },

    logoutUser: (req, res) => {
        req.logout(() => {
            res.redirect("/");
        });
    }
};
