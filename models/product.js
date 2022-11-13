const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide product name"],
    trim: true,
    maxlength: [120, "product name should not be more than 120 char"],
  },

  name: {
    type: Number,
    required: [true, "please provide product price"],

    maxlength: [6, "product price should not be more than 6 digit"],
  },

  description: {
    type: String,
    required: [true, "please provide product description"],
  },

  description: {
    type: String,
    required: [true, "please provide product description"],
  },

  photos: [
    {
      id: {
        type: String,
        required: true,
      },

      secure_url: {
        type: String,
        required: true,
      },
    },
  ],

  category: {
    type: String,
    required: [
      true,
      "please select category from-short-sleevs,long-sleevs,sweet-shirts,hoodies",
    ],
    enum: {
      values: ["shortsleevs", "longsleevs", "sweetshirts", "hoodies"],
      message:
        "please select category only from-short-sleevs,long-sleevs,sweet-shirts,hoodies",
    },
  },
  brand: {
    type: String,
    required: [true, "please add a new brand for clothing"],
  },

  ratings: {
    type: Number,
    default: 0,
  },

  numberOfReviews: {
    type: Number,
    default: 0,
  },

  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },

      rating: {
        type: Number,
        required: true,
      },

      comments: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
