const { connectToDb } = require("../connection/dbConnection");
const { Book, Review, Basket, User } = require("../schema/schemaIndex");
connectToDb();
async function dropBookCollection() {
  try {
    const deletedBooks = await Book.deleteMany({});
    return deletedBooks;
  } catch (error) {
    console.log("🔴 ~ dropBookCollection ~ error:", error);
  }
}

async function dropReviewsCollection() {
  try {
    const deletedReviews = await Review.deleteMany({});
    return deletedReviews;
  } catch (error) {
    console.log("🔴 ~ dropReviewsCollection ~ error:", error);
  }
}

async function dropBasketCollection() {
  try {
    const deletedReviews = await Basket.deleteMany({});
    return deletedReviews;
  } catch (error) {
    console.log("🔴 ~ dropBasketCollection ~ error:", error);
  }
}
async function dropUsersCollection() {
  try {
    const deletedReviews = await User.deleteMany({});
    return deletedReviews;
  } catch (error) {
    console.log("🔴 ~ dropUsersCollection ~ error:", error);
  }
}

async function dropCollections() {
  try {
    await dropBookCollection();
    await dropReviewsCollection();
    await dropBasketCollection();
    await dropUsersCollection();
    console.log("🟢 ~ All collections were wiped out.");
  } catch (error) {
    console.log("🔴 ~ dropCollections ~ error:", error);
  }
}

module.exports = dropCollections;
