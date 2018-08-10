var express = require("express");
var router  = express.Router({mergeParams: true});
var Post    = require("../models/post");
var Comment = require("../models/comment");
var User    = require("../models/user");

//comments new
router.get("/new", isLoggedIn, function(req, res) {
    //find campground by id
    Post.findById(req.params.id, function(err, post){
       if(err){
           console.log(err);
       } else {
          res.render("comments/new", {post: post}); //can make another page called new if put inside another dir
       }
    });
});
//comments create
router.post("/", isLoggedIn, function(req, res){ //must add isLoggedIn function to post request as well becuase even though we prevent user form seing form new page when not logged in user could still for ex. go to postmates to submit a post request and still post a comment even though not loggedin
   //look up campground by id
   Campground.findById(req.params.id, function(err, post){
      if(err){
          console.log(err);
          res.redirect("/posts");
      } else {
          //create new comment
          Comment.create(req.body.comment, function(err, comment){ //we do not need hard code an object as the first argument because we set up an obejct in the new.js file when we named the attributes of the form. this creates an object with author and text
             if(err){
                 console.log(err);
             } else {
                 //add username and id to comment
                 comment.author.id = req.user._id;
                 comment.author.username = req.user.username;
                 console.log(comment.author);
                 comment.save();
                 //associate newly created comment to selected campground
                 post.comments.push(comment);
                 post.save();
                 res.redirect("/posts/" + post._id);
             }
          });
      }
   });
});
//is logged in middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
       return next(); //must return next() otherwise will contintue to redirect
    }
    res.redirect("/login");
}
module.exports = router;
