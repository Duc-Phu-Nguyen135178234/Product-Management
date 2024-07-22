module.exports.createPost = async (req, res, next) => {
    if(!req.body.title) {
      req.flash("error", "Please fill in Title!");
      res.redirect("back");
      return;
    }
  
    next();
  }