var express     = require("express"),
    router      = express.Router(),
    Campground  = require("../models/campground"),
    middleware  = require("../middleware");

// ===========
// Campgrounds
// ===========

// INDEX - Get all campgrounds
router.get("/", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// NEW - Create a new Campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// SHOW - Show information about one campground
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// CREATE - Add a campground to the DB
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    var newCampground = {
        name: name,
        price: price,
        description: desc,
        author: author
    };
    
    var fileExt = image.split('.').pop();
    if (fileExt == "png" || fileExt == "jpg" || fileExt == "jpeg" || fileExt == "gif") {
            newCampground.image = image;
        }

    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// EDIT - Form to edit a campground's data
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                res.redirect("back");
            } else {
                res.render("campgrounds/edit", {campground: foundCampground});
            }
    });
});

// UPDATE - request to put the updated data in the database
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    var image = req.body.campground.image;
    var fileExt = image.split('.').pop();
    if(fileExt !== undefined) {
        if (fileExt === "png" || fileExt === "jpg" || fileExt === "jpeg" || fileExt === "gif") {
            image = req.body.campground.image;
        } else {
            image = "http://www.yellowstonenationalparklodges.com/wp-content/gallery/madison-campground/madison-campground-11.jpg";
            Campground.findById(req.params.id, function(err, foundCampground) {
                if (err) {
                    console.log(err);
                } else {
                    image = foundCampground.image;
                }
            });
        }
    } else {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                console.log(err);
            } else {
                image = foundCampground.image;
            }
        });
    }
    
    var updatedCampground = {
        name: req.body.campground.name,
        description: req.body.campground.description,
        price: req.body.campground.price,
        image: image
    };
    
    Campground.findByIdAndUpdate(req.params.id, {
        $set: {
            name: updatedCampground.name,
            description: updatedCampground.description,
            price: updatedCampground.price, 
            image: updatedCampground.image}},
            {new: true}, function(err, foundCampground) {
                if (err) {
                    res.redirect("/campgrounds");
                } else {
                    res.redirect("/campgrounds/" + req.params.id);
                }
    });
});

// DESTROY - Remove a campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;