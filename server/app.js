const express = require("express");
const {
  postNewUser,
  userSignIn,
  deleteUserProfile,
  getBooks,
  getBookById,
  postReviewByBookId,
  getReviewsByBookId,
  deleteReviewById,
  updateReviewById,
} = require("./controllers/controller");
const customErrorHandler = require("./utilities/customErrors");
const app = express();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(express.json());

//Users and Authentication
app.post("/api/create_profile", upload.single("image"), (req, res) => {
  postNewUser(req, res);
});
app.post("/api/sign_in", userSignIn);
app.delete("/api/delete_profile", deleteUserProfile);
// Books
app.get("/api/books", getBooks);
app.get("/api/books/:book_id", getBookById);
// Reviews
app.post("/api/reviews/:book_id", postReviewByBookId);
app.get("/api/reviews/:book_id", getReviewsByBookId);
app.delete("/api/reviews/:review_id", deleteReviewById);
app.patch("/api/reviews/:review_id", updateReviewById);

app.use(customErrorHandler);

module.exports = app;
