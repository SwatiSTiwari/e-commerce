const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide a name"],
    maxlength: [40, "name should be under 40 characters"],
  },
  email: {
    type: String,
    required: [true, "please provide an email"],
    validate: [validator.isEmail, "please enter email in correct format"],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "please provide a password"],
    minlength: [6, "password should be atleasr 6 characters"],
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },

  photo: {
    id: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
  },

  forgotPasswordToken: String,
  forgotPasswordExpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// encrypt password before save

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// validate the password with passes on user password
userSchema.method.isValidatedPassword = async function (usersendPassword) {
  return await bcrypt.compare(usersendPassword, this.password);
};

//create and return jwt token
userSchema.method.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

//generate forgot password token(string)
userSchema.method.getForgotPasswordToken = function () {
  //generate a long and random string
  const forgotToken = crypto.randomBytes(20).toString("hex");

  //getting  a hash- make sure to get hash on backend
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");

  //time of token
  this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
  return forgotToken;
};

module.exports = mongoose.model("User", userSchema);
