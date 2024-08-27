const express = require("express");
const router = express.Router();
const {
  homeController,
  contactController,
  yieldController,
} = require("../controllers/home.controller");

router.get("/", homeController);
router.get("/contact", contactController);

router.get("/yieldPrediction", yieldController);

module.exports = router;
