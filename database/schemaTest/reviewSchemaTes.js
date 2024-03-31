const { Schema, model, mongoose } = require("mongoose");

const reviewSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  bookId: String,
  userName: String,
  reviewBody: String,
  createdAt: String,
  rating: Number,
});

const Review = model("Review", reviewSchema);

module.exports = Review;
