const Account = require("../../model/account.model");
const md5 = require("md5");
const systemConfig = require("../../config/system");

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
  res.render("admin/pages/auth/login", {
    pageTitle: "Sign In"
  });
}

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const account = await Account.findOne({
    email: email,
    deleted: false
  });

  if(!account) {
    req.flash("error", "Email does not exist in the system!");
    res.redirect("back");
    return;
  }

  if(md5(password) != account.password) {
    req.flash("error", "Invalid password!");
    res.redirect("back");
    return;
  }

  if(account.status != "active") {
    req.flash("error", "Account have been locked!");
    res.redirect("back");
    return;
  }

  res.cookie("token", account.token);
  res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
}