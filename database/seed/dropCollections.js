const { connectToDb } = require("../connection/dbConnection");
const { Book, Review } = require("../schema/schemaIndex");
connectToDb();
async function dropBookCollection() {
  try {
    const deletedBooks = await Book.deleteMany({});
    return deletedBooks;
  } catch (error) {
    console.log(error);
  } finally {
    console.log("🟢 ~ Books collection wiped out.");
  }
}

async function dropReviewsCollection() {
  try {
    const deletedReviews = await Review.deleteMany({});
    return deletedReviews;
  } catch (error) {
  } finally {
    console.log("🟢 ~ Reviews collection wiped out.");
  }
}
async function dropCollections() {
  await dropBookCollection();
  await dropReviewsCollection();
}

module.exports = dropCollections;
