const mongoose = require("mongoose");
const { Book, Review, User } = require("../../database/schema/schemaIndex");

async function updateBookRating(book_id) {
  // Get all the reviews
  const allReviews = await Review.find({ bookId: book_id });

  let ratingsSum = 0;
  const aggregate = allReviews.forEach(
    (review) => (ratingsSum += review.rating)
  );

  const ratingAverage = ratingsSum / allReviews.length;
  const averageResult = Number(ratingAverage.toFixed(1));
  // get the book by id
  await Book.findByIdAndUpdate(book_id, {
    $set: { rating: averageResult, timesRated: allReviews.length },
  });
}

module.exports = { updateBookRating };
