const express = require("express");
const {
  getBooks,
  postNewUser,
  getBookById,
  postReviewByBookId,
} = require("./controllers/controller");
const { customErrorHandler } = require("./errorHandling/customErrors");
const app = express();

app.use(express.json());

app.post("/api/create_user", postNewUser);
// Books
app.get("/api/books", getBooks);
app.get("/api/books/:book_id", getBookById);
// Reviews
app.post("/api/reviews/:book_id", postReviewByBookId);

app.use(customErrorHandler);
module.exports = app;
