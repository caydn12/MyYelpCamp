var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
    campName: String,
    campImage: String,
    campDescription: String
});

module.exports = mongoose.model("Campground", campgroundSchema);