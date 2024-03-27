const { fetchBooks, saveNewUser, fetchBookById } = require("../models/model");

async function postNewUser(request, response, next) {
  try {
    const { password, email, userName, userBio } = request.body;
    const userNew = await saveNewUser(password, email, userName, userBio);
    response.status(201).send({ user: userNew });
  } catch (error) {
    //The error here comes from the promise reject.
    //Then the error is gonna be passed into the next() function
    console.log(error, "from controllers");
    next(error);
  }
}

async function getBooks(req, res) {
  const books = await fetchBooks();
  res.status(200).send({ books: books });
}

async function getBookById(req, res) {
  const { book_id } = req.params
  const book = await fetchBookById(book_id);

  res.status(200).send({ book: book })
}

module.exports = { getBooks, postNewUser, getBookById };
