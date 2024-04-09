// const { auth } = require("../../Firebase/Manage_Users/FBauthentication");
const {
  saveNewUser,
  userLogIn,
  userLogOut,
  removeUserProfile,
  changeAccountDetails,
  changeAccountCredentials,
  fetchBooks,
  fetchBookById,
  sendBookReview,
  fetchReviewsByBookId,
  removeReviewById,
  amendReviewById,
  createBasket,
  sendToBasket,
} = require("../models/model");

//=================== [  USER CONTROLLERS  ] ===================//

async function postNewUser(req, res, next) {
  try {
    const { userFirstName, userLastName, userEmail, password } = req.body;
    console.log(req.body, "from controller 21");
    const newUser = await saveNewUser(
      userFirstName,
      userLastName,
      userEmail,
      password
    );

    const basket = await createBasket(newUser);
    res.status(201).send({ user: newUser });
  } catch (error) {
    next(error);
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
async function userSignOut(req, res, next) {
  try {
    await userLogOut();
    res.status(200).send({ msg: "User logged out" });
  } catch (error) {
    next(error);
  }
}
async function deleteUserProfile(req, res, next) {
  try {
    const removed = await removeUserProfile();
    res.status(200).send({ removed: removed });
  } catch (error) {
    next(error);
  }
}
async function modifyAccountDetails(req, res, next) {
  try {
    const { userFirstName, userLastName } = req.body;

    const changes = await changeAccountDetails(userFirstName, userLastName);
    res.status(200).send({ updatedUser: changes });
  } catch (error) {
    next(error);
  }
}
async function modifyAccountCredentials() {
  try {
    await changeAccountCredentials();
  } catch (error) {}
} //In progress

//=================== [  BOOKS CONTROLLERS  ] ===================//

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

//=================== [  REVIEWS CONTROLLERS  ] ===================//

async function postReviewByBookId(req, res, next) {
  try {
    const { book_id } = req.params;
    const { reviewBody, rating } = req.body;

    const review = await sendBookReview(book_id, reviewBody, rating);

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

//=================== [  BASKET CONTROLLERS  ] ===================//

async function addToBasket(req, res, next) {
  try {
    const { productId } = req.body;
    const quantity = req.body.quantity ? Number(req.body.quantity) : 1;
    const basket = await sendToBasket(productId, quantity);
    res.status(200).send({ msg: "Item added to the basket successfully!" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  postNewUser,
  userSignIn,
  modifyAccountDetails,
  modifyAccountCredentials,
  userSignOut,
  deleteUserProfile,
  getBooks,
  getBookById,
  postReviewByBookId,
  getReviewsByBookId,
  deleteReviewById,
  updateReviewById,
  addToBasket,
};
