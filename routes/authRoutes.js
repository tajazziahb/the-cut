const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

/*
    Router map (Express docs: https://expressjs.com/en/guide/routing.html):
    - GET / → marketing homepage.
    - GET/POST /signup → registration form.
    - GET/POST /login → authentication.
    - GET /logout → destroy session.
*/
router.get("/", (req, res) => {
    res.render("home", {
        title: "The Cut",
        user: req.user || null
    });
});

router.get("/signup", authController.signupPage);
router.post("/signup", authController.signupUser);
router.get("/login", authController.loginPage);
router.post("/login", authController.loginUser);
router.get("/logout", authController.logoutUser);

module.exports = router;
