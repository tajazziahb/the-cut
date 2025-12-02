module.exports = function requireAuth(req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.redirect("/login");
    }
    next();
};
