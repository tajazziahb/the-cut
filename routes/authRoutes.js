const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");

// homepage
router.get("/", (req, res) => {
    res.render("home");
});

// signup
router.get("/signup", authController.signupPage);
router.post("/signup", authController.signupUser);

// login
router.get("/login", authController.loginPage);
router.post("/login", authController.loginUser);

// logout
router.get("/logout", authController.logoutUser);

module.exports = router;
