var mongoose    = require("mongoose"),
    Post        = require("./models/post"),
    Comment     = require("./models/comment"),
    Users       = require("./models/user");

var data = [
  {
    title: "Do you know how to travel?",
    image: "https://images.pexels.com/photos/346768/pexels-photo-346768.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    body: "Do You know that there are a lot of different ways how to travel with a limited budget? Let's talk here about some ways you could travel to Europe within 100$ for a weekend"
  },
  {
    title: "Legal for you",
    image: "https://images.pexels.com/photos/618158/pexels-photo-618158.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    title: "Interesting facts about photo",
    image: "https://images.pexels.com/photos/442573/pexels-photo-442573.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  }
]

function seedDB(){
Post.remove({}, function(err){
  if(err){
    console.log(err)
  }else{
  console.log("REMOVED ALL POSTS");
  data.forEach(function(seed){
    Post.create(seed, function(err, post){
      if(err){
        console.log(err);
      } else {
        console.log("added a post");
        //add a comment
        Comment.create({
          text: "This is really awesome tips. I will contact the author to get his time",
          author: "Bengamin"
        }, function(err, comment){
          if(err){
            console.log(err);
          } else{
            post.comments.push(comment);
            post.save();
            console.log("NEW COMMENT CREATED!");
          }

        });
      }
    });
  })
}
});

}

module.exports = seedDB;
