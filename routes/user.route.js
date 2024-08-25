const express = require("express");
const router = express.Router();
const {
  renderSignUpPage,
  renderLoginPage,
  registerUser,
  loginUser,
} = require("../controllers/user.controller");
const validateSignUpUser = require("../middlewares/validateSignUpUser.middleware");
const validateLoginUser = require("../middlewares/validateLoginUser.middleware");
const upload = require("../middlewares/multer.middleware");

router.get("/registerUser", renderSignUpPage);
router.post(
  "/register",
  upload.single("avatar"),
  validateSignUpUser,
  registerUser
);
router.get("/loginUser", renderLoginPage);
router.post("/login", validateLoginUser, loginUser);

module.exports = router;
