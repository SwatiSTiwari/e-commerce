const express = require("express");
const router = express.Router();
const {
  sendStripKey,
  captureStripPayment,
  sendStripKey,
} = require("../controllers/paymentController");
const { isLoggedIn } = require("../middleware/user");

router.route("/stripkey").get(isLoggedIn, sendStripKey);

module.exports = router;
