const mongoose = require("mongoose");
const { DB_URL } = require("../config/index");

module.exports = async () => {
  try {
    await mongoose.connect(DB_URL);

    console.log("connected to the database 👍");
  } catch (error) {
    console.log("Error =============================");
    console.log(error);
    process.exit(1);
  }
};
