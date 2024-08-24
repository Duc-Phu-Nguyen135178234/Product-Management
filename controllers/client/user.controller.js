const md5 = require("md5"); 

const User = require("../../model/user.model");
const ForgotPassword = require("../../model/forgot-password.model");

// Import the helper module for generating random strings

const generateHelper = require("../../helpers/generate.helper"); 

//add helper using send OTP nodemailer
const sendEmailHelper = require("../../helpers/sendEmail.helper");

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

//[GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect("/user/login");
}


// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Lấy lại mật khẩu",
  });
};

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({
    email: email,
    deleted: false
  });

  if(!user) {
    req.flash("error", "Email không tồn tại trong hệ thống!");
    res.redirect("back");
    return;
  }

  const otp = generateHelper.generateRandomNumber(6);

  // Việc 1: Lưu email, OTP vào database
  const forgotPasswordData = {
    email: email,
    otp: otp,
    expireAt: Date.now() + 3*60*1000
  };

  const forgotPassword = new ForgotPassword(forgotPasswordData);
  await forgotPassword.save();

  // Việc 2: Gửi mã OTP qua email của user (Tạm thời coi như xong, làm sau)

  const subject = "OTP reset password.";
  const htmlSendMail = `Your OTP is <b style="color: green;">${otp}</b>. OTP is valided in 3 mins.`;
  sendEmailHelper.sendEmail(email, subject, htmlSendMail);


  res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;

  res.render("client/pages/user/otp-password", {
    pageTitle: "Verify OTP",
    email: email
  });
};

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  });

  if (!result) {
    req.flash("error", "Invalid OTP!");
    res.redirect("back");
    return;
  }

  const user = await User.findOne({
    email: email
  });

  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/user/password/reset");
};

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Change New Password"
  });
};


// [PATCH] /user/password/reset
module.exports.resetPasswordPatch = async (req, res) => {
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;

  await User.updateOne({
    tokenUser: tokenUser,
    deleted: false
  }, {
    password: md5(password)
  });

  res.redirect("/");
};