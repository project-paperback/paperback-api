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
    const ratingAverage =
      ratingsSum / allReviews.length ? ratingsSum / allReviews.length : 0;
    const averageResult = Number(ratingAverage.toFixed(1));
    // get the book by id
    await Book.findByIdAndUpdate(book_id, {
      $set: { rating: averageResult, timesRated: allReviews.length },
    });
  } catch (error) {
    console.log(error, "from utils.js");
  }
}
function filters(
  publisher,
  rating,
  categories,
  year_from,
  year_to,
  min_price,
  max_price
) {
  const filters = {};
  if (publisher) {
    filters.publisher = publisher;
  } else if (rating) {
    filters.rating = rating;
  } else if (categories) {
    filters.categories = { $in: categories };
  }
  if (year_from && year_to) {
    filters.price = { $gte: year_from, $lte: year_to };
  } else if (year_from) {
    filters.price = { $gte: year_from };
  } else if (year_to) {
    filters.price = { $lte: year_to };
  }
  if (min_price && max_price) {
    filters.price = { $gte: min_price, $lte: max_price };
  } else if (min_price) {
    filters.price = { $gte: min_price };
  } else if (max_price) {
    filters.price = { $lte: max_price };
  }
  return filters;
}
module.exports = { updateBookRating, filters };
