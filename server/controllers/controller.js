const {
  fetchBooks,
  saveNewUser,
  fetchBookById,
  sendBookReview,
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

module.exports = {
  getBooks,
  postNewUser,
  getBookById,
  postReviewByBookId,
};
