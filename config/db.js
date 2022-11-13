const mongoose = require("mongoose");

const connectWithDb = () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("Db got connected"))
    .catch((error) => {
      console.log("db connection failed");
      console.log(error);
      process.exit();
    });
};

module.exports = connectWithDb;
