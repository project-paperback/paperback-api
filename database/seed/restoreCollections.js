const { testDb } = require("../connection/dbConnection");
const { bookData, reviewData } = require("./jsonData/dataIndex");
const Book = require("../schemaTest/bookSchemaTest");
const Review = require("../schemaTest/reviewSchemaTes");

testDb();
async function restoreBookCollection() {
  try {
    await Book.insertMany(bookData);
  } catch (error) {
    console.log("🔴 ~ restoreBookCollection ~ error:", error);
  } finally {
    console.log("🟢 ~ All books have been restored succesfully.");
  }
}

async function restoreReviewCollection() {
  try {
    // testDb();
    await Review.insertMany(reviewData);
  } catch (error) {
    console.log("🔴 ~ restoreReviewCollection ~ error:", error);
  } finally {
    console.log("🟢 ~ All Reviews have been restored succesfully.");
  }
}
// restoreBookCollection();
// restoreReviewCollection();

module.exports = {
  restoreBookCollection,
  restoreReviewCollection,
};
