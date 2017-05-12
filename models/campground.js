var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: { type: String, default: "http://www.yellowstonenationalparklodges.com/wp-content/gallery/madison-campground/madison-campground-11.jpg" },
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }    
    ]
});

module.exports = mongoose.model("Campground", campgroundSchema);