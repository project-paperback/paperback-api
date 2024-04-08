const { connectToDb } = require("../connection/dbConnection");
const { bookData, reviewData } = require("./jsonData/dataIndex");
const { Book, Review } = require("../schema/schemaIndex");

connectToDb();
async function restoreBookCollection() {
  try {
    await Book.insertMany(bookData);
  } catch (error) {
    console.log("🔴 ~ restoreBookCollection ~ error:", error);
  } finally {
    // console.log("🟢 ~ All books have been restored succesfully.");
  }
}

async function restoreReviewCollection() {
  try {
    await Review.insertMany(reviewData);
  } catch (error) {
    console.log("🔴 ~ restoreReviewCollection ~ error:", error);
  } finally {
    // console.log("🟢 ~ All Reviews have been restored succesfully.");
  }
}

async function restoreColletions() {
  await restoreBookCollection();
  await restoreReviewCollection();
  console.log("🟢 ~ All collections were restored succesfully.");
}
module.exports = restoreColletions;
