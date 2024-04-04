const { Schema, model } = require("mongoose");

const industryIdentifierSchema = new Schema({
  type: String,
  identifier: String
});

const imageLinks = new Schema({
  smallThumbnail: String,
  thumbnail: String
});

const bookSchema = new Schema({
  title: { type: String, immutable: true },
  subtitle: String,
  authors: [String],
  publisher: String,
  publishedDate: String,
  description: String,
  industryIdentifiers: [ industryIdentifierSchema ],
  pageCount: Number,
  printType: String,
  categories: [String],
  maturityRating: String,
  allowAnonLogging: Boolean,
  contentVersion: String,
  imageLinks: imageLinks,
  language: String,
  previewLink: String,
  infoLink: String,
  canonicalVolumeLink: String,
  price: Number,
  quantity: Number,
  rating: { type: Number, default: 0 },
  isbn: { type: String,}
})



const Book = model("Book", bookSchema);

module.exports = Book;
