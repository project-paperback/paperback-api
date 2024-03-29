const express = require("express");
const {
  getBooks,
  postNewUser,
  getBookById,
  postReviewByBookId,
  getReviewsById
} = require("./controllers/controller");
const { customErrorHandler } = require("./utilities/customErrors");
const app = express();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(express.json());

app.post("/api/create_user", upload.single("image"), (req, res) => {
  postNewUser(req, res);
});
// Books
app.get("/api/books", getBooks);
app.get("/api/books/:book_id", getBookById);
// Reviews
app.post("/api/reviews/:book_id", postReviewByBookId);
app.get("/api/reviews/:book_id", getReviewsById)

app.use(customErrorHandler);
module.exports = app;
