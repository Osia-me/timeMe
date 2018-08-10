var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

//SCHEMA SETTING UP
var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  yearOfBirth: Number,
  job: String,
  experience: Number,
  image: String,
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
