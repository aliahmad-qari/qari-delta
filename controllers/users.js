  const User = require("../models/user.js");
const passport = require("passport");
  
  
  module.exports.RenderSignUpForm = async (req, res) => {
    res.render("users/signup");
  }
module.exports.RenderLoginForm = async (req, res) => {
    res.render("users/login");
  }


module.exports.signUp=async (req, res, next) => {
    try {
      let { username, email, password } = req.body;
      let newUser = await new User({ username, email });
      let registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Wonderlast!");
        res.redirect("/allList");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  };

module.exports.login=async (req, res,next) => {
    req.flash("success", "Login Success welcome to wonderlast");
    res.redirect(res.locals.redirect || "/allList");

  };
module.exports.logout=async (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Goodbye, you were logged out");
      res.redirect("/allList");
    });
  };
