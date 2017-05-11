var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObject = {};

var logInErrorMsg = "Please Login";
var dataNotFoundErrorMsg = "Could not locate the ";
var permissionDeniedErrorMsg = "Account does not have those permissions";

middlewareObject.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("errorMessage", logInErrorMsg);
        res.redirect("/login");
    }
}

middlewareObject.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                req.flash("errorMessage", dataNotFoundErrorMsg + "comment");
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("errorMessage", permissionDeniedErrorMsg);
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("errorMessage", logInErrorMsg);
        res.redirect("back");
    }
}

middlewareObject.checkCampgroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                req.flash("errorMessage", dataNotFoundErrorMsg + "campground");
                res.redirect("back");
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("errorMessage", permissionDeniedErrorMsg);
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("errorMessage", logInErrorMsg);
        res.redirect("back");
    }
}

module.exports = middlewareObject;