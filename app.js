//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
//############################ Server Connection #########################################################
// app.listen(port);
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started on port #: " + port);
});
//########################################################################################################

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ mongodb Connection @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// mongoose.connect("mongodb+srv://admin-mongodb:ash@Net1@ashwani.1ranw.mongodb.net/todolistDB", {
//   useNewUrlParser: true
// });

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Mongo Connected");
});

function closeConnection() {
  mongoose.connection.close();
};

//^^^^^^^^^^^^^^^^^^^^^^ Setup Mongo Collection ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret = process.env.SECRET
userSchema.plugin(encrypt,{secret:secret, encryptedFields: ['password']});

const User = mongoose.model("User", userSchema);


//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@



app.get("/",function(req,res){
  res.render("home");
});
app.get("/home",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});


app.post("/register",function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password

  });
  newUser.save(function(err){
    if(err){
      res.send(err);
    }else{
      res.render("secrets");
    }
  });
});

app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email:username},function(err,foundUser){
    if(err){
      console.log(err);
    }else{
      if (foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }else{
          res.send("Incorrect Password");
        }

      }
    }
  });
});
