const BigPromiss = require("../middleware/bigPromiss");
const strip = require("strip")(process.env.STRIP_SECRET);

exports.sendStripKey = BigPromiss(async (req, res, next) => {
  res.status(200).json({
    stripkey: process.env.STRIPE_API_KEY,
  });
});

exports.captureStripPayment = BigPromiss(async (req, res, next) => {
  const paymentIntent = await strip.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",

    metadata: { integration_click: "accept_a_payment" },
  });

  res.status(200).json({
    success: true,
    client_secret: paymentIntent.client_secret,

    // can send id as well
  });
});
