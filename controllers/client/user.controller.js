const md5 = require("md5"); 

const User = require("../../model/user.model");

// Import the helper module for generating random strings

const generateHelper = require("../../helpers/generate.helper"); 

// [GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Register Account", 
  });
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  const existUser = await User.findOne({
    email: req.body.email,
    deleted: false
  });

  if(existUser) {
    req.flash("error", "Email is existing!");
    res.redirect("back");
    return;
  }

  const userData = {
    fullName: req.body.fullName, 
    email: req.body.email,
    password: md5(req.body.password), 
    tokenUser: generateHelper.generateRandomString(30) // Generate a random 30-character string as the user's token
  };

  const user = new User(userData);
  await user.save();

  res.cookie("tokenUser", user.tokenUser);
  req.flash("success", "Register is successful !");
  res.redirect("/");
};

// [GET] /user/login
module.exports.login = async (req, res) => {
  // Render the login page for the user with the specified page title
  res.render("client/pages/user/login", {
    pageTitle: "Login to your account",
  });
};

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  // Find a user in the database based on the provided email
  const user = await User.findOne({
    email: req.body.email,
    deleted: false
  });

  
  if(!user) {
    req.flash("error", "Email does not exist!");
    res.redirect("back");
    return;
  }

  // If the password does not match
  if(md5(req.body.password) != user.password) {
    req.flash("error", "Incorrect password!");
    res.redirect("back");
    return;
  }

  // If the user's account status is not active, 
  if(user.status != "active") {
    req.flash("error", "Account is locked!");
    res.redirect("back");
    return;
  }

  // Set a cookie with the user's token to maintain the session
  res.cookie("tokenUser", user.tokenUser);

  // Flash a success message and redirect to the homepage
  req.flash("success", "Login successful!");
  res.redirect("/");
};