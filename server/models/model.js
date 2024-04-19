const {
  auth,
  newUser,
  signIn,
  signOut,
  deleteUser,
  sendEmailVerification,
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
  updatePassword,
} = require("../../Firebase/Manage_Users/FBauthentication.js");
const {
  Book,
  Review,
  User,
  Basket,
  ShoppingHistory,
  Orders,
} = require("../../database/schema/schemaIndex.js");
const { connectToDb } = require("../../database/connection/dbConnection.js");
const { updateBookRating, filters } = require("../utilities/utils.js");
const endpoints = require("../../endpoints.json");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

connectToDb();

async function fetchEndpoints() {
  try {
    return endpoints;
  } catch (error) {
    console.log("🚀 ~ fetchEndpoints ~ error:", error);
    return error;
  }
}

//=================== [  USER MODELS  ] ===================//

async function saveNewUser(userFirstName, userLastName, userEmail, password) {
  try {
    if (!userFirstName && !userLastName && !userEmail && !password) {
      return Promise.reject({
        status: 400,
        msg: "Looks like some fields are missing! Please fill out all required fields to complete your sign-up.",
      });
    } else if (!password) {
      return Promise.reject({
        status: 400,
        msg: "Password is required to sign up",
      });
    } else if (!userEmail) {
      return Promise.reject({
        status: 400,
        msg: "Email is required to sign up",
      });
    } else if (!userFirstName) {
      return Promise.reject({
        status: 400,
        msg: "Name and last name are required to sign up",
      });
    }

    const addUser = await newUser(auth, userEmail, password);
    await sendEmailVerification(addUser.user); // this line is going to send the verification email
    const newUserMongo = new User({
      fbUid: addUser.user.uid,
      userFirstName: userFirstName,
      userLastName: userLastName,
      userEmail: addUser.user.email,
    });
    await newUserMongo.save();
    return newUserMongo;
  } catch (error) {
    return Promise.reject({
      status: 400,
      msg: error.customData._tokenResponse.error.message,
    });
  }
}
async function removeUserProfile() {
  try {
    const user = auth.currentUser;

    if (user) {
      const fireUid = user.uid;
      const userRemoved = await User.findOneAndDelete({ fbUid: fireUid });
      const basketRemoved = await Basket.findOneAndDelete({ fbUid: fireUid });
      const shoppingHistoryRemoved = await ShoppingHistory.findOneAndDelete({
        fbUid: fireUid,
      });
      await deleteUser(user);
      return {
        userFirstName: userRemoved.userFirstName,
        userLastName: userRemoved.userLastName,
        userEmail: userRemoved.userEmail,
      };
    } else {
      throw new Error("Unauthorized request");
    }
  } catch (error) {
    if (error.message === "Unauthorized request") {
      return Promise.reject({ status: 401, msg: "Unauthorized request" });
    } else {
      console.log(error);
    }
  }
}
async function userLogIn(email, password) {
  try {
    if (!email && !password) {
      return Promise.reject({ status: 400, msg: "Email and password missing" });
    } else if (!email) {
      return Promise.reject({ status: 400, msg: "Email required to log in" });
    } else if (!password) {
      return Promise.reject({
        status: 400,
        msg: "Password required to log in",
      });
    }
    const signUserIn = await signIn(auth, email, password);

    return { userEmail: signUserIn.user.email, msg: "Logged in!" };
  } catch (error) {
    if (error.code === "auth/invalid-credential") {
      return Promise.reject({
        status: 401,
        msg: "Wrong credentials. Are you signed up?",
      });
    } else {
      console.log(error);
      return Promise.reject({ status: 500, msg: "Internal server error" });
    }
  }
}
async function userLogOut() {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("Opps, you are not logged in!");
    } else {
      await signOut(auth);
      return "User logged out";
    }
  } catch (error) {
    if (error.message === "Opps, you are not logged in!") {
      console.log(error.message);
      return Promise.reject({
        status: 400,
        msg: "Opps, you are not logged in!",
      });
    } else {
      console.log(error);
      return Promise.reject({ status: 500, msg: "Internal server error" });
    }
  }
}
async function changeAccountDetails(firstName, lastName) {
  try {
    const user = auth.currentUser;
    if (user) {
      const fbUid = user.uid;
      const findUser = await User.find({ fbUid: fbUid });

      if (findUser) {
        const filter = { fbUid: fbUid };
        const updatedUser = await User.findOneAndUpdate(filter, {
          userFirstName: firstName,
          userLastName: lastName,
        });
        const userReviews = await Review.find({ uid: fbUid });

        if (userReviews.length > 0) {
          const userName = {
            userName: `${findUser.userFirstName} ${findUser.userLastName}`,
          };
          const filter = { uid: fbUid };
          await Review.updateMany(filter);
        }
        const appResponse = {
          userFirstName: updatedUser.userFirstName,
          userLastName: updatedUser.userLastName,
          userEmail: updatedUser.userEmail,
        };
        return appResponse;
      }
    } else {
      throw new Error("You need to be logged in to change your details");
    }
  } catch (error) {
    if (error.message === "You need to be logged in to change your details") {
      return Promise.reject({
        status: 401,
        msg: "You need to be logged in to change your details",
      });
    } else {
      console.log(error);
      return Promise.reject({ status: 500, msg: "Internal server error" });
    }
  }
}
async function changeAccountPassword(
  newPassword,
  currentPassword,
  confirmPassword
) {
  try {
    //Validate Old Password
    const user = auth.currentUser;
    console.log(user);
    if (user) {
      if (newPassword === confirmPassword) {
        const userEmail = user.email;
        const credentials = EmailAuthProvider.credential(
          userEmail,
          currentPassword
        );
        //Reuthenticate user before updating the password due to the security risk of unauthorized modifications
        await reauthenticateWithCredential(user, credentials);
        //Update password
        await updatePassword(user, newPassword);
        return "Password has been updates successfully!";
      } else {
        return Promise.reject({
          status: 400,
          msg: "The passwords you entered don't match.",
        });
      }
    } else {
      throw new Error(
        "You need to be logged in to change your password details"
      );
    }
  } catch (error) {
    if (
      error.message ===
      "You need to be logged in to change your password details"
    ) {
      return Promise.reject({
        status: 401,
        msg: "You need to be logged in to change your password details",
      });
    } else if (error.code === "auth/too-many-requests") {
      return Promise.reject({
        status: 403,
        msg: "Access to this account has been temporarily disabled",
      });
    } else {
      console.log(error);
      return Promise.reject({ status: 500, msg: "Internal server error" });
    }
  }
} //work on this endpoint further
async function changeAccountEmail(newEmailAdress) {
  try {
    const user = auth.currentUser;
    if (user) {
      await verifyBeforeUpdateEmail(user, newEmailAdress);

      return "Check your email inbox and click on the verification link to finish the update";
    } else {
      throw new Error("You need to be logged in to change your email details");
    }
  } catch (error) {
    if (
      error.message === "You need to be logged in to change your email details"
    ) {
      return Promise.reject({
        status: 401,
        msg: "You need to be logged in to change your email details",
      });
    } else {
      console.log(error);
      return Promise.reject({ status: 500, msg: "Internal server error" });
    }
  }
}

//=================== [  BOOK MODELS  ] ===================//

async function fetchBooks(
  publisher,
  rating,
  categories,
  year_from,
  year_to,
  min_price,
  max_price
) {
  try {
    const queries = filters(
      publisher,
      rating,
      categories,
      year_from,
      year_to,
      min_price,
      max_price
    );
    console.log(queries);
    const books = await Book.find(queries).limit(10);
    if (books.length === 0) {
      return Promise.reject({
        status: 200,
        msg: "More books coming soon!",
      });
    }

    return books;
  } catch (error) {
    if (error.name === "ValidationError") {
      return { status: 400, message: "Invalid request parameters" };
    } else {
      console.log(error);
    }
  }
}

async function fetchBookById(id) {
  try {
    const book = await Book.findById(id);
    if (book === null) {
      return Promise.reject({ status: 404, msg: "Book not found" });
    } else {
      return book;
    }
  } catch (error) {
    if (error.kind === "ObjectId") {
      return Promise.reject({ status: 400, msg: "Invalid book id" });
    }
  }
}

//=================== [  REVIEW MODELS  ] ===================//

async function fetchReviewsByBookId(book_id) {
  try {
    const isBookInCollection = await Book.findById(book_id);

    if (isBookInCollection === null) {
      return Promise.reject({ status: 404, msg: "Book not found" });
    }
    const reviews = await Review.find(
      { bookId: book_id },
      "userName reviewBody createdAt rating bookId"
    );
    if (reviews.length === 0) {
      return Promise.reject({
        status: 200,
        msg: "This book hasn't been reviewed yet",
      });
    }
    return reviews;
  } catch (error) {
    if (error.kind === "ObjectId") {
      return Promise.reject({ status: 400, msg: "Invalid book id" });
    }
  }
}

async function sendBookReview(book_id, reviewBody, rating) {
  try {
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      const userMgdb = await User.find({ fbUid: uid });
      const userName =
        userMgdb[0].userFirstName + " " + userMgdb[0].userLastName;
      if (!rating) {
        return Promise.reject({ status: 400, msg: "Missing rating" });
      }
      const isBookInCollection = await Book.findById(book_id);
      if (isBookInCollection === null) {
        return Promise.reject({ status: 404, msg: "Book to review not found" });
      }
      const reviewsInCollection = await Review.find({
        userName: userName,
        bookId: book_id,
      });
      if (reviewsInCollection.length > 0) {
        return Promise.reject({
          status: 400,
          msg: "You cannot review this item again",
        });
      }
      const review = new Review({
        bookId: book_id,
        userName: userName, //This value is going to change based on logged in user
        reviewBody: reviewBody,
        createdAt: new Date(),
        rating: rating,
        fbUid: uid,
      });
      await review.save();
      await updateBookRating(book_id);
      return {
        _id: review._id,
        bookId: review.bookId,
        userName: review.userName,
        reviewBody: review.reviewBody,
        createdAt: review.createdAt,
        rating: review.rating,
      };
    } else {
      throw new Error("You need to be logged in to leave a review");
    }
  } catch (error) {
    if (error.message === "You need to be logged in to leave a review") {
      return Promise.reject({
        status: 401,
        msg: "You need to be logged in to leave a review",
      });
    } else {
      console.log(error);
    }
  }
}

async function removeReviewById(review_id) {
  try {
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      const findReview = await Review.findById(review_id);
      if (!findReview) {
        return Promise.reject({ status: 404, msg: "Review not found" });
      }
      if (findReview.fbUid !== uid) {
        return Promise.reject({
          status: 401,
          msg: "You are not allowed to delete other user's reviews",
        });
      }
      const bookId = findReview.bookId;
      const deletedReview = await Review.findByIdAndDelete(review_id);
      await updateBookRating(bookId);
      return {
        _id: deletedReview._id,
        bookId: deletedReview.bookId,
        userName: deletedReview.userName,
        reviewBody: deletedReview.reviewBody,
        createdAt: deletedReview.createdAt,
        rating: deletedReview.rating,
      };
    } else {
      throw new Error("You need to be logged in to delete a review");
    }
  } catch (error) {
    if (error.kind === "ObjectId") {
      return Promise.reject({ status: 400, msg: "Invalid review Id" });
    } else if (
      error.message === "You need to be logged in to delete a review"
    ) {
      return Promise.reject({
        status: 401,
        msg: "You need to be logged in to delete a review",
      });
    } else {
      console.log(error);
      return Promise.reject({ status: 500, msg: "Internal server error" });
    }
  }
}

async function amendReviewById(review_id, reviewBody, rating) {
  try {
    const user = auth.currentUser;

    if (user) {
      const uid = user.uid;
      const findReview = await Review.findById(review_id);
      if (!findReview) {
        return Promise.reject({ status: 404, msg: "Review not found" });
      }
      if (findReview.fbUid !== uid) {
        return Promise.reject({
          status: 401,
          msg: "You are not allowed to modify other user's reviews",
        });
      }
      const bookId = findReview.bookId;
      const newUpdates = { reviewBody, rating };
      const updatedReview = await Review.findByIdAndUpdate(
        review_id,
        newUpdates,
        { new: true }
      );
      await updateBookRating(bookId);
      return {
        _id: updatedReview._id,
        bookId: updatedReview.bookId,
        userName: updatedReview.userName,
        reviewBody: updatedReview.reviewBody,
        createdAt: updatedReview.createdAt,
        rating: updatedReview.rating,
      };
    } else {
      throw new Error("You need to be logged in to modify a review");
    }
  } catch (error) {
    if (error.kind === "ObjectId") {
      return Promise.reject({ status: 400, msg: "Invalid review Id" });
    } else if (
      error.message === "You need to be logged in to modify a review"
    ) {
      return Promise.reject({
        status: 401,
        msg: "You need to be logged in to modify a review",
      });
    } else {
      console.log(error);
      return Promise.reject({ status: 500, msg: "Internal server error" });
    }
  }
}

//=================== [  BASKET MODELS  ] ===================//

async function createBasket(userNew) {
  try {
    const basket = await Basket.create({
      userEmail: userNew.userEmail,
      fbUid: userNew.fbUid,
      userId: userNew._id,
      items: [],
    });
    await User.findByIdAndUpdate(userNew._id, { basketId: basket._id });
    return basket;
  } catch (error) {
    console.log(error);
  }
}
async function createShoppingHistory(userNew) {
  try {
    const shoppingHistory = await ShoppingHistory.create({
      userEmail: userNew.userEmail,
      fbUid: userNew.fbUid,
      userId: userNew._id,
      purchasedItems: [],
    });
    await User.findByIdAndUpdate(userNew._id, {
      shoppingHistoryId: shoppingHistory._id,
    });
    return shoppingHistory;
  } catch (error) {
    console.log(error);
  }
}

async function sendToBasket(productId, quantity) {
  try {
    const user = auth.currentUser;
    if (!user) {
      return Promise.reject({
        status: 401,
        msg: "You need to be logged in to add items to the basket",
      });
    }

    const fbUid = user.uid;
    const book = await Book.findById(productId);
    if (book === null) {
      return Promise.reject({ status: 404, msg: "Book not found" });
    }
    const basket = await Basket.findOne({ fbUid: fbUid });
    if (!basket) {
      return Promise.reject({ status: 404, msg: "Shopping cart not found" });
    }
    const existingItem = basket.items.find(
      (item) => item.product.toString() === productId
    );
    if (existingItem) {
      // If the item already exists, update its quantity
      existingItem.quantity += quantity;
    } else {
      // If the item doesn't exist, add it to the items array
      basket.items.push({
        product: productId,
        quantity: quantity,
        description: book.title,
        price: book.price,
      });
    }

    await basket.save();
  } catch (error) {
    if (
      error.reason
        .toString()
        .startsWith("BSONError: input must be a 24 character hex string")
    ) {
      return Promise.reject({
        status: 400,
        msg: "Invalid book Id, input must be a 24 character hex string, 12 byte Uint8Array, or an integer",
      });
    }
  }
}

async function removeFromBasketById(book_id) {
  try {
    const user = auth.currentUser;
    if (!user) {
      return Promise.reject({
        status: 401,
        msg: "You need to be logged in to remove items from the basket",
      });
    }
    const fbUid = user.uid;
    const basket = await Basket.findOne({ fbUid: fbUid });
    if (!basket)
      return Promise.reject({ status: 404, msg: "Shopping cart not found" });
    if (basket.items.length === 0) throw new Error("No books in the basket");

    const foundItem = basket.items.filter(
      (item) => item.product.toString() === book_id
    );
    if (foundItem.length === 0) throw new Error("Book not found");
    basket.items.forEach((item) => {
      if (item.product.toString() === book_id) {
        const bookIndexToDelete = basket.items.indexOf(item);
        basket.items.splice(bookIndexToDelete, 1);
      }
    });
    await basket.save();
  } catch (error) {
    if (error.message === "Book not found") {
      return Promise.reject({
        status: 404,
        msg: "Book not found",
      });
    } else if (error.message === "No books in the basket") {
      return Promise.reject({
        status: 404,
        msg: "No books in the basket",
      });
    }
  }
}

async function payment() {
  try {
    const user = auth.currentUser;
    if (!user) {
      return Promise.reject({
        status: 401,
        msg: "You need to be logged in to checkout the basket",
      });
    }
    const fbUid = user.uid;
    const basket = await Basket.findOne({ fbUid: fbUid });
    if (!basket)
      return Promise.reject({ status: 404, msg: "Shopping cart not found" });
    const items = basket.items;
    if (items.length === 0) {
      return Promise.reject({ status: 400, msg: "No items in the basket" });
    }

    const booksInBasket = await Promise.all(
      items.map(async (item) => {
        const book = await fetchBookById(item.product.toString());
        return book;
      })
    );
    booksInBasket.forEach((book, index) => {
      if (items[index].quantity > book.quantity) {
        throw new Error("Item not available");
      }
    });

    const createdProducts = await Promise.all(
      items.map(async (book) => {
        const bookInDb = await fetchBookById(book.product.toString());
        return await stripe.products.create({
          name: bookInDb.title,
          images: [
            "https://i.pinimg.com/564x/08/97/ac/0897ac613a913be42c85408bd8dd2012.jpg",
          ],
          shippable: true,
        });
      })
    );

    const createdPrices = await Promise.all(
      createdProducts.map(async (product, index) => {
        return await stripe.prices.create({
          unit_amount: Math.floor(items[index].price * 100),
          currency: "gbp",
          product: product.id,
        });
      })
    );

    const session = await stripe.checkout.sessions.create({
      success_url:
        "https://i.pinimg.com/564x/ad/58/d5/ad58d5fa341bb0de51d29dc1c7b18fe1.jpg", // TO BE CHANGED
      cancel_url:
        "https://i.pinimg.com/564x/ad/58/d5/ad58d5fa341bb0de51d29dc1c7b18fe1.jpg", // TO BE CHANGED
      line_items: createdPrices.map((item, index) => {
        return {
          price: item.id,
          quantity: items[index].quantity,
        };
      }),
      mode: "payment",
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // Expires in 30 minutes
      shipping_address_collection: {
        allowed_countries: ["GB"], // Specify allowed countries for shipping
      },
      // Pass shipping address here
    });
    return session.url;
  } catch (error) {
    console.log(error);
    if (error.message === "Item not available") {
      return Promise.reject({ status: 400, msg: "Item not available" });
    }
  }
}

async function amendStock(event) {
  const user = auth.currentUser;
  const fbUid = user.uid;
  if (event.type === "charge.succeeded") {
    const basket = await Basket.findOne({ fbUid: fbUid });
    const shoppingHistory = await ShoppingHistory.findOne({ fbUid: fbUid });

    const booksInBasket = await Promise.all(
      basket.items.map(async (item) => {
        return await fetchBookById(item.product.toString());
      })
    );

    booksInBasket.forEach(async (book, index) => {
      book.quantity -= basket.items[index].quantity;
      book.save();
    });
    const products = booksInBasket.map((item, index) => ({
      product: item._id,
      quantity: basket.items[index].quantity,
      description: item.title, // Assuming 'title' is the property for book description
      price: item.price,
    }));

    const order = new Orders({
      fbUid,
      productsBought: products,
      purchaseDate: new Date(),
      invoiceUrl: event.data.object.receipt_url,
    });
    console.log(order, "line 750");
    await order.save();
    await shoppingHistory.updateOne({ $push: { purchaseHistory: order } });
    basket.items = [];
    basket.save();
  }
}

module.exports = {
  fetchEndpoints,
  saveNewUser,
  userLogIn,
  userLogOut,
  changeAccountDetails,
  changeAccountEmail,
  changeAccountPassword,
  removeUserProfile,
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
};
