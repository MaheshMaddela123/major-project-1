const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../Utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router
  .route("/signup")
  .get(userController.registerUser)
  .post(wrapAsync(userController.postSignup));

router
  .route("/login")
  .get(userController.getUser)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.postUSer
  );

router.get("/logout", userController.userLogout);

module.exports = router;
