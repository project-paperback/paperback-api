const express = require("express");
const {
  postNewUser,
  userSignIn,
  userSignOut,
  modifyAccountDetails,
  modifyAccountCredentials,
  deleteUserProfile,
  getBooks,
  getBookById,
  postReviewByBookId,
  getReviewsByBookId,
  deleteReviewById,
  updateReviewById,
  addToBasket,
} = require("./controllers/controller");
const customErrorHandler = require("./utilities/customErrors");
const app = express();
app.use(express.json());

//Users and Authentication
app.post("/api/create_account", postNewUser);
app.post("/api/sign_in", userSignIn);
app.post("/api/sign_out", userSignOut);
app.patch("/api/account_details", modifyAccountDetails);
app.patch("/api/account_credentials", modifyAccountCredentials);
app.delete("/api/delete_account", deleteUserProfile);
// Books
app.get("/api/books", getBooks);
app.get("/api/books/:book_id", getBookById);
// Reviews
app.post("/api/reviews/:book_id", postReviewByBookId);
app.get("/api/reviews/:book_id", getReviewsByBookId);
app.delete("/api/reviews/:review_id", deleteReviewById);
app.patch("/api/reviews/:review_id", updateReviewById);
//Basket
app.post("/api/add_to_basket", addToBasket);

app.use(customErrorHandler);

module.exports = app;
