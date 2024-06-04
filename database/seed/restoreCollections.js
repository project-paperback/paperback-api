const { connectToDb } = require("../connection/dbConnection");
const {
  bookData,
  reviewData,
  userData,
  basketData,
} = require("./jsonData/dataIndex");
const { Book, Review, Basket, User } = require("../schema/schemaIndex");
connectToDb();
async function restoreBookCollection() {
  try {
    await Book.insertMany(bookData);
  } catch (error) {
    console.log("🔴 ~ restoreBookCollection ~ error:", error);
  }
}

async function restoreReviewCollection() {
  try {
    await Review.insertMany(reviewData);
  } catch (error) {
    console.log("🔴 ~ restoreReviewCollection ~ error:", error);
  }
}
async function restoreUserCollection() {
  try {
    await User.insertMany(userData);
  } catch (error) {
    console.log("🔴  ~ restoreUserCollection ~ error:", error);
  }
}
async function restoreBasketCollection() {
  try {
    await Basket.insertMany(basketData);
  } catch (error) {
    console.log("🔴  ~ restoreBasketCollection ~ error:", error);
  }
}

async function restoreColletions() {
  try {
    await restoreBookCollection();
    // await restoreReviewCollection();
    // await restoreBasketCollection();
    // await restoreUserCollection();
    console.log("🟢 ~ All collections were restored succesfully.");
  } catch (error) {
    console.log("🔴 ~ restoreColletions ~ error:", error);
  }
}

module.exports = restoreColletions;
