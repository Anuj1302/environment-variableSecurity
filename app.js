require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption")

const app = express();
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email : String,
    password : String
})
// const secret  = "Thisisourlittlesecret";
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

mongoose.connect('mongodb://127.0.0.1:27017/userDB', {
  useNewUrlParser: true
});


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
app.get("/", function(req, res){
    res.render("home");
})
app.get("/login", function(req, res){
    res.render("login");
})
app.get("/register", function(req, res){
    res.render("register");
})
app.get("/secrets", function(req, res){
    res.render("secrets");
})

app.post("/register", function(req,res){
  // const username = req.body.username;
  // const password = 
  const newUser = new User({
    email : req.body.username,
    password : req.body.password
  });
  newUser.save();
});

app.post("/login", function(req,res){
  User.find({ email: req.body.username })
  .then(docs => {
    if (docs[0].password === req.body.password ) {
      res.render("secrets")
    } else {
      res.send("Incorrect username or password")

    }
    // res.send(docs)
    console.log(docs);
  })
  .catch(err => {
    console.error(err);
    res.send("An error occurred");
  });
  
})

