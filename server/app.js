const express = require("express");
const cors = require("cors");
const {
  getEndpoints,
  postNewUser,
  userSignIn,
  userSignOut,
  modifyAccountDetails,
  modifyAccountPassword,
  modifyAccountEmail,
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
app.use(cors());
// Endpoints
app.get("/api", getEndpoints);

//Users and Authentication
app.post("/api/create_account", postNewUser);
app.post("/api/sign_in", userSignIn);
app.post("/api/sign_out", userSignOut);
app.patch("/api/account_details", modifyAccountDetails);
app.patch("/api/change_email", modifyAccountEmail);
app.patch("/api/change_password", modifyAccountPassword);

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

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});
app.use(customErrorHandler);

module.exports = app;
