const User = require("../models/user");
const BigPromiss = require("../middleware/bigPromiss");
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");
const mailHelper = require("../utils/emailHelper");
const crypto = require("crypto");
exports.signup = BigPromiss(async (req, res, next) => {
  // let result;
  if (!req.files) {
    return next(new CustomError("photo is required for signup", 400));
  }

  const { name, email, password } = req.body;

  if (!email || !name || !password) {
    return next(new CustomError("please send emaill", 400));
  }

  let file = req.files.photo;

  const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
    folder: "users",
    width: 150,
    crop: "scale",
  });

  const user = await User.create({
    name,
    email,
    password,
    photo: {
      id: result.public_id,
      secure_url: result.secure_url,
    },
  });

  cookieToken(user, res);
});

exports.login = BigPromiss(async (req, res, next) => {
  const { email, password } = req.body;

  //check for presence of email and password

  if (!email || !password) {
    return next(new CustomError("please provide email and password", 400));
  }

  // get user from db
  const user = await User.findOne({ email }).select("+password");

  //if user not found in db
  if (!user) {
    return next(
      new CustomError("you are not registered in our database ", 400)
    );
  }

  //match the password
  const isPasswordCorrect = await user.isValidatedPassword(password);

  // if password does not match
  if (!isPasswordCorrect) {
    return next(new CustomError("email and password does not exist  ", 400));
  }

  // send the token
  cookieToken(user, res);
});

exports.logout = BigPromiss(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    succes: true,
    message: "Logout success",
  });
});

exports.forgotPassword = BigPromiss(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new CustomError("email not found as register ", 400));
  }

  const forgotToken = user.getForgotPasswordToken();

  await user.save({ validateBeforeSave: false });

  const myUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${forgotToken}`;

  const message = `copy paste this link in your URL and hit enter \n\n ${myUrl}`;

  try {
    await mailHelper({
      email: user.email,
      subject: "tshitstore- password reset email",
      message,
    });

    res.status(200).json({
      succes: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new CustomError(error.message, 500));
  }
});

exports.passwordReset = BigPromiss(async (req, res, next) => {
  const token = req.params.token;

  const encryToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    encryToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new CustomError("Token is invalid or expires", 400));
  }

  if (req.body.password != req.body.confirmPassword) {
    return next(
      new CustomError("password and confirm password does not match", 400)
    );
  }

  user.password = req.body.password;

  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save();
  //send json respond or send toekn
  cookieToken(user, res); //toekn
});

exports.getLoggedInUserDetails = BigPromiss(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    succes: true,
    user,
  });
});
