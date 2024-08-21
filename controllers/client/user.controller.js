const md5 = require("md5"); 

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
  const userData = {
    fullName: req.body.fullName, 
    email: req.body.email,
    password: md5(req.body.password), 
    tokenUser: generateHelper.generateRandomString(30) // Generate a random 30-character string as the user's token
  };

  console.log(userData); 

  res.send("OK"); 
};
