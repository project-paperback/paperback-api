const { testDb, endConnection } = require("../connection/dbConnection");
const Book = require("../schemaTest/bookSchemaTest");
const Review = require("../schemaTest/reviewSchemaTes");

testDb();
async function dropBookCollection() {
  try {
    const deletedBooks = await Book.deleteMany({});
    return deletedBooks;
  } catch (error) {
    console.log(error);
  } finally {
    console.log("🟢 ~ Books collection whiped out.");
  }
}

async function dropReviewsCollection() {
  try {
    const deletedReviews = await Review.deleteMany({});
    return deletedReviews;
  } catch (error) {
  } finally {
    console.log("🟢 ~ Reviews collection whiped out.");
  }
}

// dropReviewsCollection();
// dropBookCollection();
module.exports = {
  dropReviewsCollection,
  dropBookCollection,
};
