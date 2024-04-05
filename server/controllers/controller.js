const {
  saveNewUser,
  userLogIn,
  removeUserProfile,
  fetchBooks,
  fetchBookById,
  sendBookReview,
  fetchReviewsByBookId,
  removeReviewById,
  amendReviewById,
  createBasket,
} = require("../models/model");

async function postNewUser(req, res, next) {
  try {
    const { password, email, userName, userBio } = req.body;

    const userNew = await saveNewUser(password, email, userName, userBio, req);

    const basket = await createBasket(userNew)

    res.status(201).send({ user: userNew });
  } catch (error) {
    if (error.status === 400) {
      if (error.msg === "Password is required") {
        res.status(400).send({ msg: "Password is required" });
      } else if (error.msg === "Username is required") {
        res.status(400).send({ msg: "Username is required" });
      } else if (error.msg === "Email is required") {
        res.status(400).send({ msg: "Email is required" });
      } else if (error.msg === "EMAIL_EXISTS") {
        res.status(400).send({ msg: "Email already in use" });
      }
    }
  }
}
async function userSignIn(req, res, next) {
  try {
    const { email, password } = req.body;

    const logIn = await userLogIn(email, password);
    res.status(200).send({ loggedIn: logIn });
  } catch (error) {
    next(error);
  }
}

async function deleteUserProfile(req, res, next) {
  try {
    const removed = await removeUserProfile();
    res.status(200).send({ removed: removed });
  } catch (error) {
    console.log("🚀 ~ deleteUserProfile ~ error:", error);
  }
}

//=========================================================

async function getBooks(req, res, next) {
  try {
    const books = await fetchBooks();

    res.status(200).send({ books: books });
  } catch (error) {
    next(error);
  }
}

async function getBookById(req, res, next) {
  try {
    const { book_id } = req.params;
    const book = await fetchBookById(book_id);

    res.status(200).send({ book: book });
  } catch (error) {
    next(error);
  }
}

async function postReviewByBookId(req, res, next) {
  try {
    const { book_id } = req.params;
    const { userName, reviewBody, rating } = req.body;

    const review = await sendBookReview(book_id, userName, reviewBody, rating);

    res.status(201).send({ review: review });
  } catch (error) {
    next(error);
  }
}

async function getReviewsByBookId(req, res, next) {
  try {
    const { book_id } = req.params;
    const reviews = await fetchReviewsByBookId(book_id);
    res.status(200).send({ reviews: reviews });
  } catch (error) {
    next(error);
  }
}

async function deleteReviewById(req, res, next) {
  try {
    const { review_id } = req.params;
    const deletedReview = await removeReviewById(review_id);
    res.status(200).send({ deletedReview: deletedReview });
  } catch (error) {
    next(error);
  }
}

async function updateReviewById(req, res, next) {
  try {
    const { review_id } = req.params;
    const { reviewBody, rating } = req.body;
    const updatedReview = await amendReviewById(review_id, reviewBody, rating);
    res.status(200).send({ updatedReview: updatedReview });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  postNewUser,
  userSignIn,
  deleteUserProfile,
  getBooks,
  getBookById,
  postReviewByBookId,
  getReviewsByBookId,
  deleteReviewById,
  updateReviewById,
};
