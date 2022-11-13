const express = require("express");
const {
  addProduct,
  getAllProduct,
} = require("../controllers/productController");
const router = express.Router();
const { isLoggedIn, customRole } = require("../middleware/user");

router.route("/testproduct").get();
router.route("product").get(getAllProduct);

router.route("/product/add").post(isLoggedIn, customRole("user"), addProduct);

module.exports = router;
