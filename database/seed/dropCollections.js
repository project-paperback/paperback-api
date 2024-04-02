const { dataBase, endConnection } = require("../connection/dbConnection");
// const TestBook = require("../schemaTest/bookSchemaTest");
// const TestReview = require("../schemaTest/reviewSchemaTes");
const { Book, Review } = require("../schema/schemaIndex");
dataBase();
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
async function dropCollections() {
  await dropBookCollection();
  await dropReviewsCollection();
}

module.exports = dropCollections;
