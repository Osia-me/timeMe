var express   = require("express");
var router    = express.Router();
var passport  = require("passport");
var User      = require("../models/user");

router.get("/", function(req, res){
  res.render("landing");
});

//AUTH ROUTES
router.get("/register", function(req, res){
  res.render("register");
});
//handle sign up logic
router.post("/register", function(req, res){
  var newUser = new User(
    {
      username: req.body.username,
      firstName: req.body.firstName,
      lastName:req.body.lastName,
      avatar: req.body.avatar,
      email: req.body.email,
      yearOfBirth: req.body.yearOfBirth,
      job: req.body.job,
      experience: req.body.experience,
      city: req.body.city,
      country: req.body.country,
      description: req.body.description
    });

  if(req.body.adminCode === SECRETCODE) {
      newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
      if(err){
        req.flash("error", err.message);
        return res.redirect("/register");
    }
      passport.authenticate("local")(req, res, function(){
      req.flash("success", "Welcome to timeMe " + req.body.username);
      res.redirect("/users");
    });
  });
});

//show login form
router.get("/login", function(req, res){
  res.render("login");
});

//handle login logic
router.post("/login", passport.authenticate("local",
{
  successRedirect: "/users",
  failureRedirect: "/login"
}), function(req, res){
});

//add logout route
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("back");
});


module.exports = router;
