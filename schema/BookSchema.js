import { Schema, model } from "mongoose";

const bookSchema = new Schema({
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

export default Book;
