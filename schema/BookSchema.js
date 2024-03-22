import mongoose from "mongoose";

const { Schema, model } = mongoose;

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
});

const Book = model("Book", bookSchema);

export default Book;
