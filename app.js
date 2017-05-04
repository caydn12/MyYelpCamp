// NPM
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
// Models
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
// Seed Data
    seedDB          = require("./seeds");
    
seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Not sure what a good secret is, but I figure this works for now!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// App setup
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// ============================
// CAMPGROUNDS ROUTES
// ============================
app.get("/", function(req, res) {
    res.render("landing");
});

// INDEX - Get all campgrounds
app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds})
        }
    });
});

// NEW - Create a new Campground
app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
});

// SHOW - Show information about one campground
app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// CREATE - Add a campground to the DB
app.post("/campgrounds", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    
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

// ============================
// COMMENTS ROUTES
// ============================

// NEW - Comment Form
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// CREATE - Add Comment to DB
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// ============================
// AUTHORIZATION ROUTES
// ============================

// Show Register Form
app.get("/register", function(req, res) {
    res.render("register");
});

// Handle Register Logic
app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.render("register");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/campgrounds");
            });
        }
    });
});

// Show Login Form
app.get("/login", function(req, res) {
    res.render("login");
});

// Handle Login Logic
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
    }), function(req, res) { });
    
// Logout Route
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

// Listen for requests
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp running..."); 
});

// ============================
// Middleware
// ============================
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}