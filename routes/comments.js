var express = require("express");
var router  = express.Router({mergeParams: true});
var Post    = require("../models/post");
var Comment = require("../models/comment");
var User    = require("../models/user");

//Comments new
router.get("/new", isLoggedIn, function(req, res){
  //find post by id
  Post.findById(req.params.id, function(err, post){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new", {post: post});
    }
  });
});

//Comments create
router.post("/", isLoggedIn, function(req,res){
  //lookup post using ID
  Post.findById(req.params.id, function(err, post){
    if(err){
      console.log(err);
      res.redirect("/posts");
    } else {
      //create new comment
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        } else {
          //connect new comment to post
          post.comments.push(comment);
          post.save();
          //redirect
          res.redirect("/posts/" + post._id);
        }
      });
    }
  });
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
};

module.exports = router;
