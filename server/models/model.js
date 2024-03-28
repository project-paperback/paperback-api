const mongoose = require("mongoose");
const Book = require("../../schema/BookSchema.js");
const { auth, newUser } = require("../../authentication/FBauthentication.js");

const User = require("../../schema/UserSchema.js");

mongoose.connect(
  "mongodb+srv://riccardofoti97:9DjR06YkoRabUZcS@bookshop.wtlyola.mongodb.net/development?retryWrites=true&w=majority&appName=BookShop"
);

async function saveNewUser(password, email, userName, userBio) {
  try {
    if (!userName) {
      return Promise.reject({ status: 400, msg: "Username is required" });
    } else if (!password) {
      return Promise.reject({ status: 400, msg: "Password is required" });
    } else if (!email) {
      return Promise.reject({ status: 400, msg: "Email is required" });
    }

    const addUser = await newUser(auth, email, password);

    // mongoose.connect(
    //   "mongodb+srv://riccardofoti97:9DjR06YkoRabUZcS@bookshop.wtlyola.mongodb.net/development?retryWrites=true&w=majority&appName=BookShop"
    // );

    const newUserMongo = new User({
      fbUid: addUser.user.uid,
      userName: userName,
      userBio: userBio,
      userEmail: addUser.user.email,
    });

    await newUserMongo.save();
    return newUserMongo;
  } catch (error) {
    return Promise.reject(error.customData._tokenResponse.error);
  } finally {
    // mongoose.connection.close();
  }
}

async function fetchBooks() {
  try {
    // mongoose.connect(
    //   "mongodb+srv://riccardofoti97:9DjR06YkoRabUZcS@bookshop.wtlyola.mongodb.net/development?retryWrites=true&w=majority&appName=BookShop"
    // );
    const books = await Book.find({});
    return books;
  } catch (error) {
    console.log(error);
  } finally {
    // mongoose.connection.close();
  }
}

async function fetchBookById(id) {
  try {
    // mongoose.connect(
    //   "mongodb+srv://riccardofoti97:9DjR06YkoRabUZcS@bookshop.wtlyola.mongodb.net/development?retryWrites=true&w=majority&appName=BookShop"
    // );
    const book = await Book.findById(id);
    return book;
  } catch (error) {
    console.log(error);
  } finally {
    // mongoose.connection.close()
  }
}

module.exports = { fetchBooks, saveNewUser, fetchBookById };
