const { Schema, model, mongoose } = require("mongoose");

const bookSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, immutable: true },
  author: String,
  year: Number,
  pages: Number,
  genres: [String],
  language: String,
  isFiction: Boolean,
  publisher: String,
  bookPrice: Number,
  isbn: Number,
  qty: Number,
  rating: { type: Number, default: 0 },
});

const Book = model("Book", bookSchema);

module.exports = Book;
