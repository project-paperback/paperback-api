import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
  bookId: String,
  userName: String,
  reviewBody: String,
  createdAt: Date,
  rating: Number,
});

const Review = model("Review", reviewSchema);

export default Review;
