// NPM
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
// Models
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
// Seed Data
    seedDB          = require("./seeds");
    
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    authRoutes         = require("./routes/index");
    
seedDB(); 

// App setup
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

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

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.use("/", authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// Listen for requests
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp running..."); 
});
