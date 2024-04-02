const {
  fetchBooks,
  saveNewUser,
  fetchBookById,
  sendBookReview,
  fetchReviewsById,
  removeReviewById,
  amendReviewById,
} = require("../models/model");

async function postNewUser(req, res, next) {
  try {
    const { password, email, userName, userBio } = req.body;
    const userNew = await saveNewUser(password, email, userName, userBio, req);
    res.status(201).send({ user: userNew });
  } catch (error) {
    next(error);
  }
}

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

async function getReviewsById(req, res, next) {
  try {
    const { book_id } = req.params;
    const reviews = await fetchReviewsById(book_id)
    res.status(200).send({ reviews : reviews })
  } catch (error) {
    next(error)
  }
}


async function deleteReviewById(req, res, next) {
  try {
    const { review_id } = req.params;
    const deletedReview = await removeReviewById(review_id)
    res.status(200).send({ deletedReview : deletedReview })
  } catch (error) {
    next(error)
  }
}

async function updateReviewById(req, res, next) {
  try {
    const { review_id } = req.params;
    const { reviewBody, rating } = req.body
    const updatedReview = await amendReviewById(review_id, reviewBody, rating)
    res.status(200).send({ updatedReview : updatedReview})
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getBooks,
  postNewUser,
  getBookById,
  postReviewByBookId,
  getReviewsById,
  deleteReviewById,
  updateReviewById
};
