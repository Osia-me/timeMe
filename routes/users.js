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


module.exports = router;
