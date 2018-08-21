var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    expressSan     = require("express-sanitizer"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    Post           = require("./models/post"),
    Comment        = require("./models/comment"),
    User           = require("./models/user"),
    Review         = require("./models/review"),
    seedDB         = require("./seeds.js");


var commentRoutes = require("./routes/comments"),
    postsRoutes   = require("./routes/posts"),
    indexRoutes   = require("./routes/index"),
    usersRoutes   = require("./routes/users"),
    reviewRoutes  = require("./routes/reviews");


//seedDB(); //seed db


app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSan());
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());


mongoose.connect("mongodb://Osia:123password@ds225382.mlab.com:25382/timeme", { useNewUrlParser: true });

//PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "time is the most important in our life!",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/posts", postsRoutes);
app.use("/users", usersRoutes);
app.use("/posts/:id/comments", commentRoutes);
app.use("/users/:id/reviews", reviewRoutes);

// SERVERHOST
app.listen(process.env.PORT || 3000, process.env.IP, function(){
   console.log("timeMe has Started!");
});
