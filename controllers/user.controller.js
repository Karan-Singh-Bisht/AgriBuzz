const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const userModel = require("../models/user.model");
const passport = require("passport");
const uploadOnCloudinary = require("../utils/cloudinary");

module.exports.renderSignUpPage = asyncHandler(async (req, res) => {
  res.render("signUp");
});

module.exports.registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, dob, gender, password, confirmPassword } =
    req.body;

  if (password != confirmPassword) {
    req.flash("error", "Password does not match!");
    return res.redirect("/user/registerUser");
  }
  const existedUser = await userModel.findOne({ email });
  if (existedUser) {
    req.flash("error", "Email already exists!");
    return res.redirect("/user/registerUser");
  }
  const avatarLocalPath = req.file?.path;
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const user = await userModel.create({
    firstName,
    lastName,
    email,
    dob,
    gender,
    password,
    avatar:
      avatar?.url ||
      "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?w=826&t=st=1723037395~exp=1723037995~hmac=88fe535ef9ac7e7658d485f74eaf8ffe444366fb43fb67ba7719c1969f068fad",
  });

  if (!user) {
    throw new ApiError(500, "User not created!");
  }
  req.login(user, (err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", `Welcome to SIH ${firstName}`);
    res.redirect("/user/registerUser"); //Redirect to home page
  });
});

module.exports.renderLoginPage = asyncHandler(async (req, res) => {
  res.render("login");
});

module.exports.loginUser = asyncHandler(async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    } // Handle any errors

    if (!user) {
      req.flash("error", info.message || "Login failed.");
      return res.redirect("/user/loginUser");
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      req.flash("success", `Welcome Back ${user.firstName}`);
      res.redirect("/user/loginUser"); //Redirect to home page
    });
  })(req, res, next); // Call the passport middleware
});
