const BigPromiss = require("../middleware/bigPromiss");

exports.home = BigPromiss(async (req, res) => {
  //const db=await()
  res.status(200).json({
    success: true,
    greeting: "hello from swati :))",
  });
});

exports.homeDummy = (req, res) => {
  res.status(200).json({
    success: true,
    greeting: "hello from another route :))",
  });
};
