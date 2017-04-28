var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Clouds Rest", 
        image: "https://farm5.staticflickr.com/4137/4812576807_8ba9255f38.jpg",
        description: "Blah Blah Blah"
    },
    {
        name: "Desert Mesa", 
        image: "https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg",
        description: "Blah Blah Blah"
    },
    {
        name: "Canyon Floor", 
        image: "http://www.photosforclass.com/download/2182093741",
        description: "Blah Blah Blah"
    },
]

function seedDB() {
    // Remove All Campgrounds
    Campground.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Removed Campgrounds");
            
            // Add a few campgrounds
            data.forEach(function(seed) {
               Campground.create(seed, function(err, campground) {
                   if (err) {
                       console.log(err);
                   } else {
                       console.log("added a campground");
                       
                       Comment.create(
                           {
                               text: "This place is great, but I wish there was internet",
                               author: "Homer"
                           }, function(err, comment) {
                               if (err) {
                                   console.log(err);
                               } else {
                                   campground.comments.push(comment);
                                   campground.save();
                                   console.log("Created new comment");
                               }
                           });
                   }
               });
            });
        }
    });
}

module.exports = seedDB;
