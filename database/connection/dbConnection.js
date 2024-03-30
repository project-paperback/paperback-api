const mongoose = require("mongoose");

async function testDb() {
  try {
    await mongoose.connect(
      "mongodb+srv://riccardofoti97:9DjR06YkoRabUZcS@bookshop.wtlyola.mongodb.net/testData?retryWrites=true&w=majority&appName=BookShop"
    );
  } catch (error) {}
}

async function devDb() {
  try {
    await mongoose.connect(
      "mongodb+srv://riccardofoti97:9DjR06YkoRabUZcS@bookshop.wtlyola.mongodb.net/development?retryWrites=true&w=majority&appName=BookShop"
    );
  } catch (error) {}
}

async function endConnection() {
  await mongoose.connection.close();
}
module.exports = {
  testDb,
  devDb,
  endConnection,
};

// ctrl shift L to create a console log
// Use LiveShare
