const express = require("express");
const router = express.Router();

const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const UserController = require("../controllers/users.js");


// Routes for users
router.route("/signup").get( UserController.RenderSignUpForm)
.post(
  
  wrapAsync(UserController.signUp)
);

router.route("/login").get(UserController.RenderLoginForm)
 .post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }), wrapAsync(UserController.login)
);





router.get("/logout", UserController.logout);


module.exports = router;
