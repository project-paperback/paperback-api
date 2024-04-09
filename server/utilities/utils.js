const mongoose = require("mongoose");
const { Book, Review, User } = require("../../database/schema/schemaIndex");

async function updateBookRating(book_id) {
  try {
    // Get all the reviews
    const allReviews = await Review.find({ bookId: book_id });
  
    let ratingsSum = 0;
    const aggregate = allReviews.forEach(
      (review) => (ratingsSum += review.rating)
    );
    // if the result is a truthy assign result, if it's NaN(falsy) assign 0;
    const ratingAverage = ratingsSum / allReviews.length ? ratingsSum / allReviews.length : 0;
    const averageResult = Number(ratingAverage.toFixed(1));
    // get the book by id
    await Book.findByIdAndUpdate(book_id, {
      $set: { rating: averageResult, timesRated: allReviews.length },
    });
  } catch (error) {
    console.log(error, "from utils.js")
  }
}

module.exports = { updateBookRating };
