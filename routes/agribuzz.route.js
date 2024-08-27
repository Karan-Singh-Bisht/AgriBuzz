const express = require("express");
const router = express.Router();
const {
  homeController,
  contactController,
} = require("../controllers/home.controller");

router.get("/", homeController);
router.get("/contact", contactController);

module.exports = router;
