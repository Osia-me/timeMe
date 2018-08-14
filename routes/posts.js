var express    = require("express");
var router     = express.Router({mergeParams: true});
var Post       = require("../models/post");
var middleware = require("../middleware");


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
router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("posts/new");
});

// 3. CREATE - create the post and save it to the db
router.post("/", middleware.isLoggedIn, function(req, res){
  var title = req.body.title;
  var image = req.body.image;
  var body = req.body.body;
  var author = {
      id: req.user._id,
      username: req.user.username
     }
  var newPost = {title: title, image: image, body: body, author: author}
  //Create a new post and save into the db
  Post.create(newPost, function(err, justCreatedPost){
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

// 5. EDIT POST ROUTE
router.get("/:id/edit", middleware.checkPostOwnership, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        res.render("posts/edit", {post: foundPost});
    });
});


// 6. UPDATE POST ROUTE
router.put("/:id", middleware.checkPostOwnership, function(req, res){
  //find and update correct post
  Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost){
    if(err){
      res.redirect("/posts");
    } else {
      res.redirect("/posts/" + req.params.id);
    }
  });
  //redirect somewhere
});

// 7. DESTROY POST ROUTE
router.delete("/:id", middleware.checkPostOwnership, function(req, res){
  Post.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/posts");
    } else {
      res.redirect("/posts");
    }
  });
});

module.exports = router;
