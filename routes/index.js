var express     = require("express"),
    passport    = require("passport"),
    User        = require("../models/user");

var router = express.Router();

// Root
router.get("/", function(req, res) {
    res.render("landing");
});

// ==============
// Authentication
// ==============

// Show Register Form
router.get("/register", function(req, res) {
    res.render("register");
});

// Handle Register Logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            req.flash("errorMessage", err.message);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function() {
                req.flash("successMessage", "Welcome to YelpCamp " + user.username + "!");
                res.redirect("/campgrounds");
            });
        }
    });
});

// Show Login Form
router.get("/login", function(req, res) {
    res.render("login");
});

// Handle Login Logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
    }), function(req, res) { });
    
// Logout Route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("successMessage", "Successfully Logged Out");
    res.redirect("/campgrounds");
});

module.exports = router;