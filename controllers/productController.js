const Product = require("../models/product");
const BigPromiss = require("../middleware/bigPromiss");
const CustomError = require("../utils/customError");
const cloudinary = require("cloudinary");
const WhereClause = require("../utils/whereClause");

// exports.testProduct = (req, res) => {
//   res.status(200).json({
//     success: true,
//     greeting: "this is test for product :))",
//   });
// };

exports.addProduct = BigPromiss(async (req, res, next) => {
  //images

  let imageArray = [];

  if (!req.files) {
    return next(new CustomError("images are required", 400));
  }

  if (req.files) {
    for (let index = 0; index < req.files.photos.length; index++) {
      let result = await cloudinary.v2.uploader.upload(
        req.files.photos[index].temFilePath,
        {
          folder: "products",
        }
      );
      imageArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }

  req.body.photos = imageArray;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    product,
  });
});

exports.getAllProduct = BigPromiss(async (req, res, next) => {
  const resultperPage = 6;
  const totalcountProduct = await Product.countDocuments();

  const product = new WhereClause(Product.find(), req.require)
    .search()
    .filter();

  const filteredProductNumber = product.length;

  product.pager(resultperPage);
  product = await product.base;

  res.status(200).json({
    success: true,
    product,
    totalcountProduct,
    filteredProductNumber,
  });
});
