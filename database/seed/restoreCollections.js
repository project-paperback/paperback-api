const { dataBase } = require("../connection/dbConnection");
const { bookData, reviewData } = require("./jsonData/dataIndex");
// const TestBook = require("../schemaTest/bookSchemaTest");
// const TestReview = require("../schemaTest/reviewSchemaTes");
const { Book, Review } = require("../schema/schemaIndex");
dataBase();
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

async function restoreColletions() {
  await restoreBookCollection();
  await restoreReviewCollection();
}
module.exports = restoreColletions;
