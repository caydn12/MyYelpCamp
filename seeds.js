var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Clouds Rest", 
        image: "https://farm5.staticflickr.com/4137/4812576807_8ba9255f38.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam a nibh est. Morbi in sem justo. Donec eu nibh et augue laoreet bibendum ultricies vitae nibh. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In malesuada cursus justo. Ut fermentum sapien et fringilla fringilla. Sed maximus erat elit, pellentesque dictum diam faucibus in. Fusce eget justo viverra, consequat ex et, porttitor est. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras vulputate lobortis cursus. Morbi non mauris sit amet dolor vestibulum scelerisque. Quisque feugiat sem et lectus eleifend, sed condimentum augue sagittis. Curabitur sit amet orci ut orci ultrices ultricies ac a sem. Nulla pretium ut massa non interdum. Aliquam aliquet nec velit ut tempor. "
    },
    {
        name: "Desert Mesa", 
        image: "https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam a nibh est. Morbi in sem justo. Donec eu nibh et augue laoreet bibendum ultricies vitae nibh. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In malesuada cursus justo. Ut fermentum sapien et fringilla fringilla. Sed maximus erat elit, pellentesque dictum diam faucibus in. Fusce eget justo viverra, consequat ex et, porttitor est. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras vulputate lobortis cursus. Morbi non mauris sit amet dolor vestibulum scelerisque. Quisque feugiat sem et lectus eleifend, sed condimentum augue sagittis. Curabitur sit amet orci ut orci ultrices ultricies ac a sem. Nulla pretium ut massa non interdum. Aliquam aliquet nec velit ut tempor. "
    },
    {
        name: "Canyon Floor", 
        image: "https://i.cbc.ca/1.3928992.1484065378!/fileImage/httpImage/image.jpg_gen/derivatives/16x9_620/tunnel-mountain-village-i-campground-banff.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam a nibh est. Morbi in sem justo. Donec eu nibh et augue laoreet bibendum ultricies vitae nibh. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In malesuada cursus justo. Ut fermentum sapien et fringilla fringilla. Sed maximus erat elit, pellentesque dictum diam faucibus in. Fusce eget justo viverra, consequat ex et, porttitor est. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras vulputate lobortis cursus. Morbi non mauris sit amet dolor vestibulum scelerisque. Quisque feugiat sem et lectus eleifend, sed condimentum augue sagittis. Curabitur sit amet orci ut orci ultrices ultricies ac a sem. Nulla pretium ut massa non interdum. Aliquam aliquet nec velit ut tempor. "
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
