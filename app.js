var express = require("express");
var app = express();

var campgrounds = [
        { Name: "Salmon Creek", Image: "https://farm9.staticflickr.com/8225/8524305204_43934a319d.jpg" },
        { Name: "Granite Hill", Image: "http://photosforclass.com/download/2602356334" },
        { Name: "Mountain Goat's Rest", Image: "http://photosforclass.com/download/7121865553" }
    ];

app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
     res.render("campgrounds", {campgrounds: campgrounds})
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp running..."); 
});