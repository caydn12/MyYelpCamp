// NPM
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// Models
var Campground = require("./models/campground");

// Seed
var seedDB = require("./seeds");
seedDB();

// App setup
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Routes
app.get("/", function(req, res) {
    res.render("landing");
});

// INDEX - Get all campgrounds
app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {campgrounds: allCampgrounds})
        }
    });
});

// NEW - Create a new Campground
app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

// SHOW - Show information about one campground
app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("show", {campground: foundCampground});
        }
    });
});

// CREATE - Add a campground to the DB
app.post("/campgrounds", function(req, res) {
    var name = req.body.campgroundName;
    var image = req.body.campgroundImage;
    var desc = req.body.campgroundDescription;
    
    var newCampground = {
        campName: name,
        campImage: image,
        campDescription: desc
    };
    
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp running..."); 
});