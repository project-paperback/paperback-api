const { Schema, model } = require("mongoose");

// const industryIdentifierSchema = new Schema({
//   type: String,
//   identifier: String,
// });

// const imageLinks = new Schema({
//   smallThumbnail: String,
//   thumbnail: String,
// });

const bookSchema = new Schema({
  title: String,
  authors: Array,
  publisher: String,
  publishedDate: String,
  description: String,
  industryIdentifiers: Array,
  pageCount: Number,
  printType: String,
  categories: Array,
  maturityRating: String,
  allowAnonLogging: Boolean,
  contentVersion: String,
  imageLinks: Array,
  language: String,
  previewLink: String,
  infoLink: String,
  canonicalVolumeLink: String,
  price: Number,
  quantity: Number,
  rating: { type: Number, default: 0 },
  __v: Number,
});

const Book = model("Book", bookSchema);

module.exports = Book;
