const {
  fetchEndpoints,
  saveNewUser,
  userLogIn,
  userLogOut,
  removeUserProfile,
  changeAccountDetails,
  changeAccountEmail,
  changeAccountPassword,
  fetchBooks,
  fetchBookById,
  sendBookReview,
  fetchReviewsByBookId,
  removeReviewById,
  amendReviewById,
  createBasket,
  sendToBasket,
  removeFromBasketById,
  payment,
  amendStock,
  createShoppingHistory,
  retrieveBasket,
  addOneToQty,
  removeOneFromQty,
  setQty,
} = require("../models/model");

async function getEndpoints(req, res, next) {
  try {
    const data = await fetchEndpoints();
    res.status(200).send({ endpoints: data });
  } catch (error) {
    console.log("🚀 ~ getEndpoints ~ error:", error);
    return error;
  }
}

//=================== [  USER CONTROLLERS  ] ===================//

async function postNewUser(req, res, next) {
  try {
    const { userFirstName, userLastName, userEmail, password } = req.body;
    const newUser = await saveNewUser(
      userFirstName,
      userLastName,
      userEmail,
      password
    );

    const basket = await createBasket(newUser);
    const shoppingHistory = await createShoppingHistory(newUser);
    const userResponse = {
      userFirstName: newUser.userFirstName,
      userLastName: newUser.userLastName,
      userEmail: newUser.userEmail,
    };
    res.status(201).send({ user: userResponse });
  } catch (error) {
    next(error);
  }
}
async function userSignIn(req, res, next) {
  try {
    const { email, password } = req.body;
    console.log(email);

    const logIn = await userLogIn(email, password);

    res.status(200).send({ loggedIn: logIn });
  } catch (error) {
    next(error);
  }
}
async function userSignOut(req, res, next) {
  try {
    const loggedOut = await userLogOut();
    res.status(200).send({ msg: loggedOut });
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
async function modifyAccountPassword(req, res, next) {
  try {
    const { newPassword, currentPassword, confirmPassword } = req.body;
    const changePassword = await changeAccountPassword(
      newPassword,
      currentPassword,
      confirmPassword
    );
    res.status(200).send({ msg: changePassword });
  } catch (error) {
    next(error);
  }
}
async function modifyAccountEmail(req, res, next) {
  try {
    const { newEmailAddress } = req.body;

    const updateEmail = await changeAccountEmail(newEmailAddress);
    res.status(200).send({ msg: updateEmail });
  } catch (error) {
    next(error);
  }
}

//=================== [  BOOKS CONTROLLERS  ] ===================//

async function getBooks(req, res, next) {
  try {
    const { publisher, category, page_number } = req.query;

    const books = await fetchBooks(publisher, category, page_number);

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

async function getBasket(req, res, next) {
  try {
    const basketItems = await retrieveBasket();
    res.status(200).send({ basketItems: basketItems });
  } catch (error) {
    next(error);
  }
}

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

async function increaseQtyByOne(req, res, next) {
  try {
    const { productId } = req.body;
    console.log(productId, "increase");
    const itemQty = await addOneToQty(productId);
    res.status(200).send({
      msg: "Item's quantity has been increased by one",
      quantity: itemQty,
    });
  } catch (error) {
    next(error);
  }
}

async function decreaseQtyByOne(req, res, next) {
  try {
    const { productId } = req.body;
    console.log(productId, "decrease");

    const itemQty = await removeOneFromQty(productId);
    res.status(200).send({
      msg: "Item's quantity has been decreased by one",
      quantity: itemQty,
    });
  } catch (error) {
    next(error);
  }
}

async function changeQty(req, res, next) {
  try {
    const { productId, quantity } = req.body;
    const itemQty = await setQty(productId, quantity);
    res.status(200).send({
      msg: "Item's quantity has been updated",
      quantity: itemQty,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteFromBasketByBookId(req, res, next) {
  try {
    const { book_id } = req.params;
    console.log(book_id);
    const deletedBook = await removeFromBasketById(book_id);
    res.status(200).send({ msg: "Item removed from the basket successfully!" });
  } catch (error) {
    next(error);
  }
}

//=================== [  CHECKOUT CONTROLLERS  ] ===================//

async function checkoutBasket(req, res, next) {
  try {
    const paymentURL = await payment();
    res.status(200).send({ paymentURL: paymentURL });
    console.log(paymentURL);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function updateStock(req, res, next) {
  try {
    const event = req.body;
    await amendStock(event);
    res.json({ received: true });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getEndpoints,
  postNewUser,
  userSignIn,
  modifyAccountDetails,
  modifyAccountPassword,
  modifyAccountEmail,
  userSignOut,
  deleteUserProfile,
  getBooks,
  getBookById,
  postReviewByBookId,
  getReviewsByBookId,
  deleteReviewById,
  updateReviewById,
  addToBasket,
  deleteFromBasketByBookId,
  checkoutBasket,
  updateStock,
  getBasket,
  increaseQtyByOne,
  decreaseQtyByOne,
  changeQty,
};
