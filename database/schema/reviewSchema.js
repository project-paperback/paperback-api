const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
  bookId: String,
  userName: String,
  fbUid: String,
  reviewBody: String,
  createdAt: Date,
  rating: Number,
});

const Review = model("Review", reviewSchema);

module.exports = Review;
