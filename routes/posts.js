var express    = require("express");
var router     = express.Router({mergeParams: true});
var Post       = require("../models/post");
var middleware = require("../middleware");
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'dw8olk9ey',
  api_key: '364116563175276',
  api_secret: '5kJEuqISmt6YWCv4vohHse8Dww4'
});


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
    if(err || !foundPost){
      req.flash("error", "Post not found");
      res.redirect("back");
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
      if(err || !foundPost){
        req.flash("error", "Post not found!");
      } else {
        res.render("posts/edit", {post: foundPost});
      }
    });
});


// 6. UPDATE POST ROUTE
router.put("/:id", middleware.checkPostOwnership, function(req, res){
  //find and update correct post
  Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost){
    if(err){
      req.flash("error", "Post not found!");
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
      req.flash("error", "Post not found!");
      res.redirect("/posts");
    } else {
      res.redirect("/posts");
    }
  });
});

module.exports = router;
