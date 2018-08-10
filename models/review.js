var mongoose = require("mongoose");

var reviewSchema = new mongoose.Schema({
    text: String,
    author: String,
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Review", reviewSchema);
