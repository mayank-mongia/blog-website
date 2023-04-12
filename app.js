//jshint esversion:6

// Importing the required Modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');


// Defining Starting Content for each Page
const homeStartingContent = "Welcome to the Home Page. To Create a NEW BLOG, click on COMPOSE Tab";
const aboutContent = "This is the about section of the Blog Website. ";
const contactContent = "This is the Contact Us Section of the Blog Website.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// Setting up DataBase
// Connecting to Database
mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {useNewUrlParser: true}, () => {
  console.log("Connected");
});


// Creating Schema for the Posts
const postSchema = {
  title: String,
  content: String,
  time: String
};


// Creating Model using the Schema
const Post = mongoose.model("Post", postSchema);


// Get Request for Home Route
app.get("/", function(req, res){

// Finding all Elements from the database  
  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
});



// Get Request for Compose Route
app.get("/compose", function(req, res){
  res.render("compose");
});



// Post Request for Compose Route
app.post("/compose", function(req, res){
  let current = new Date();
  currentTime = current.toLocaleDateString();

// Creating a new Post Object with the entered Content  
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
    time: currentTime
  });

// Saving the object into DataBase and redirecting to Home Route
  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});



// Get Request to view individual posts on a separate Page
app.get("/posts/:postId", function(req, res){

// Getting the Post Id for the requested Post
  const requestedPostId = req.params.postId;
  
// Finding the Post data that matches with the ID  
  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content,
      time: post.time,
      postId:requestedPostId
    });
  }); 
});



// Post Request for the individual Post
app.post("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;

// Deleting the post from the database that matches with the unique ID
  Post.deleteOne({_id:requestedPostId}, function(err) {
     if(!err){
       res.redirect("/");
     }
  });
});



// Get Request for the Post Editing Page
app.get("/editor/:postId",function(req,res){

// Getting the Post Id for the requested Post to edit
  const requestedPostId = req.params.postId;

// Finding the Post data that matches with the ID and fetching the updated Data 
  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("editor", {
      title: post.title,
      content: post.content,
      time: post.time,
      postId:requestedPostId
    });
  }); 
});



// Post Request for the Post Editing Page
app.post("/editor/:postId", function(req, res){

// Getting the Post Id for the requested Post to edit
  const requestedPostId = req.params.postId;
  
// Updating the newly edited data in the Database for the postId that matches
  Post.updateOne({_id:requestedPostId},{title:req.body.postTitle,content:req.body.postBody},(err,pst)=>{
    if(err){
         res.redirect("/editor/"+requestedPostId);
         return;
    }
    res.redirect("/posts/"+requestedPostId);
  })
});



// Get Requests for different Pages
app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


app.listen(5000, function() {
  console.log("Server started on port 3000");
});
