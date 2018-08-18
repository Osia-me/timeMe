var express    = require("express");
var router     = express.Router({mergeParams: true});
var Post       = require("../models/post");
var Comment    = require("../models/comment");
var User       = require("../models/user");
var Review     = require("../models/review");
var middleware = require("../middleware");

//Review New
router.get("/new",  middleware.isLoggedIn, function(req, res){
    // find campground by id
    User.findById(req.params.id).populate("reviews").exec(function (err, user) {
      if(err){
        console.log(err);
      } else {
        console.log(req.params.id);
        res.render("reviews/new", {user: user});
      }
    });
  });

//Review Create
router.post("/", middleware.isLoggedIn,function(req, res){
   //lookup user using ID
   User.findById(req.params.id).populate("reviews").exec(function (err, user) {
       if(err){
           console.log(err);
           res.redirect("/users");
       } else {

        Review.create(req.body.review, function(err, review){
           if(err){
             req.flash("error", "Something went wrong :(");
               console.log(err);
           } else {
              review.author.id = req.user._id;
              review.author.username = req.user.username;
               //save comment
               review.save();
               user.reviews.push(review);
               user.save();
               console.log(review);
               req.flash("success", "Successfully added review!");
               res.redirect('/users/' + user._id);
           }
        });
       }
   });
});



module.exports = router;
