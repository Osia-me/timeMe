var express = require("express");
var router  = express.Router({mergeParams: true});
var Post    = require("../models/post");
var Comment = require("../models/comment");
var User    = require("../models/user");


//1. INDEX ROUTE - all posts
router.get("/", function(req, res){
  //get all posts from db
  Post.find({}, function(err, Allposts){
    if(err){
      console.log(err);
    } else {
      //retrive them on the webpage
      res.render("posts/posts", {posts: Allposts});
    }
  })

});

//2. NEW - show form for new post
router.get("/new", function(req, res){
  res.render("posts/new");
});

// 3. CREATE - create the post and save it to the db
router.post("/", function(req, res){
  //Create a new post and save into the db
  Post.create(req.body.post, function(err, justCreatedPost){
    if(err){
      console.log(err);
    } else {
      //redirect to the page with all posts
        console.log(justCreatedPost);
        res.redirect("/posts");
    }
  });
});

// 4. SHOW
router.get("/:id", function(req, res){
  //find the campground with provided id
  Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
    if(err){
      console.log;
    } else {
      //render the show page
      res.render("posts/show", {post: foundPost});
      console.log(foundPost);
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
