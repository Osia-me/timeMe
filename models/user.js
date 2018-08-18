var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

//SCHEMA SETTING UP
var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  isAdmin: {type: Boolean, default: false},
  firstName: String,
  lastName: String,
  email: String,
  avatar: String,
  yearOfBirth: Number,
  job: String,
  experience: Number,
  city: String,
  country: String,
  description: String,
  reviews: [
       {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
       }
    ]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
