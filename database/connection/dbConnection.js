const mongoose = require("mongoose");
const ENV = process.env.NODE_ENV || "development";
require("dotenv").config({
  path: `.env.${ENV}`, //Adjust path depending on environment we execute the app
}); //.config() will help you read the .env file
const DATABASE = process.env.MONGO_DATABASE;

async function connectToDb() {
  try {
    await mongoose.connect(DATABASE);
  } catch (error) {
    console.log("❗ ~ connection to DB failed:", error);
  }
}

async function endConnection() {
  await mongoose.connection.close();
}

console.log("🟠 ~ ENVIRONTMENT:", ENV);
module.exports = {
  connectToDb,
  endConnection,
};

// ctrl shift L to create a console log
// Use LiveShare
