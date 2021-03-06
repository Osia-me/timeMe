var express = require("express");
var router  = express.Router({mergeParams: true});
var Post    = require("../models/post");
var Comment = require("../models/comment");
var User    = require("../models/user");
var middleware = require("../middleware");

//All Users
router.get("/", function(req, res){
  User.find({}, function(err, allUsers){
      if(err){
        console.log(err);
      } else {
        //retrive them on the webpage
        res.render("users/users", {users: allUsers});
      }
    });
  });

//Show User
router.get("/:id", function(req, res) {
  User.findById(req.params.id).populate("reviews").exec(function(err, foundUser) {
    if(err) {
      req.flash("error", "Something went wrong.");
      return res.redirect("/");
    }
    console.log(foundUser);
    Post.find().where('author.id').equals(foundUser._id).exec(function(err, posts) {
      if(err) {
        req.flash("error", "Something went wrong.");
        return res.redirect("/");
      }
      res.render("users/show", {user: foundUser, posts: posts});
    })
  });
});﻿

// 5. EDIT User ROUTE
router.get("/:id/edit", middleware.checkUserOwnership, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
      if(err || !foundUser){
        req.flash("error", "User not found!");
      } else {
        res.render("users/edit", {user: foundUser});
        //res.render("users/edit", {user: foundUser});
      }
    });
});

// 6. UPDATE POST ROUTE
router.put("/:id", middleware.checkUserOwnership, function(req, res){
  //find and update correct post
  User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
    if(err){
      req.flash("error", "Post not found!");
      res.redirect("/users");
    } else {
      res.redirect("/users/" + req.params.id);
    }
  });
  //redirect somewhere
});

// 7. DESTROY POST ROUTE
router.delete("/:id", middleware.checkUserOwnership, function(req, res){
  User.findByIdAndRemove(req.params.id, function(err){
    if(err){
      req.flash("error", "User not found!");
      res.redirect("/users");
    } else {
      res.redirect("/users");
    }
  });
});


module.exports = router;
