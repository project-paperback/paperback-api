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
  deleteFromBasketByBookId,
  checkoutBasket,
} = require("./controllers/controller");
const customErrorHandler = require("./utilities/customErrors");
const app = express();
app.use(express.json());
app.use(cors());
// Endpoints
app.get("/api", getEndpoints);

// Users and Authentication
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
// Basket
app.post("/api/add_to_basket", addToBasket);
app.delete("/api/remove_from_basket/:book_id", deleteFromBasketByBookId);
// Checkout
app.post("/api/checkout", checkoutBasket);


const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const endpointSecret = 'whsec_3e0b4eb83e012f294c436adf4de5e7021c34f246a70bb8a9b1b3acc9df6f695c'; // Obtain from your Stripe Dashboard

// Webhook endpoint
app.post('/webhook', (req, res) => {
  const event = req.body
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      console.log('COMPLETED')
      break;
    case 'checkout.session.failed':
      console.log('FAILED')
      break;
    case 'checkout.session.cancelled':
      console.log('CANCELLED')
      break;
    case 'checkout.session.expired':
      console.log('EXPIRED');
      break;
    default:
      // Unexpected event type
      console.log('DEFAULT VALUE')
      return res.status(400).end();
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
});


app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});
app.use(customErrorHandler);

module.exports = app;
