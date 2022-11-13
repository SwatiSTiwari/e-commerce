const User = require("../models/user");
const BigPromiss = require("../middleware/bigPromiss");
const CustomError = require("../utils/customError");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = BigPromiss(async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization").replace("Bearer", "");

  if (!token) {
    return next(new CustomError("login first to access this page"));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded.id);

  next();
});

exports.customRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new CustomError("you are not allow to use this action"));
    }
    next();
  };
};
