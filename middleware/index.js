var Post       = require("../models/post");
var Comment    = require("../models/comment");
var Review     = require("../models/review");
var middlewareObj = {};

middlewareObj.checkPostOwnership = function(req, res, next){
    if(req.isAuthenticated()){
      //if not -redirect
      Post.findById(req.params.id, function(err, foundPost){
        if(err || !foundPost){
          req.flash("error", "Post not found!");
          res.redirect("back");
        } else {
            //does user own the post?
            if(foundPost.author.id.equals(req.user._id) || req.user.isAdmin){
              next();
            } else {
              req.flash("error", "You don't have permission to do that!");
              res.redirect("back");
            }
        }
      });
    } else {
      req.flash("error", "You need to be Login to do that!");
      res.redirect("back");
    }
  }

middlewareObj.checkCommentOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    //if not -redirect
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err || !foundComment){
        req.flash("error", "Comment not found :(");
        res.redirect("back");
      } else {
          //does user own the comment?
          if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
            next();
          } else {
            req.flash("error", "You don't have permission to do that");
            res.redirect("back");
          }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("back");
  }
}

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "Please Login first!");
  res.redirect("/login");
};


module.exports = middlewareObj;
