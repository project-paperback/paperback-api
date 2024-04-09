const {
  auth,
  newUser,
  signIn,
  signOut,
  deleteUser,
} = require("../../Firebase/Manage_Users/FBauthentication.js");
const {
  Book,
  Review,
  User,
  Basket,
} = require("../../database/schema/schemaIndex.js");
const { connectToDb } = require("../../database/connection/dbConnection.js");
const { updateBookRating } = require("../utilities/utils.js");

connectToDb();

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
    const accessKey = user.accessToken;
    if (accessKey) {
      const userInfo = user.reloadUserInfo;
      const fireUid = userInfo.localId;
      const userToRemove = await User.find({ fbUid: fireUid });
      const userId = userToRemove[0]._id;
      const userRemoved = await User.findByIdAndDelete(userId);

      await deleteUser(user);

      return userRemoved;
    }
  } catch (error) {
    return Promise.reject({ status: 401, msg: "Unauthorized request" });
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
    const userInfo = {
      uid: signUserIn._tokenResponse.localId,
      email: signUserIn._tokenResponse.email,
    };
    return { userInf: userInfo, msg: "Logged in!" };
  } catch (error) {
    if (error) {
      return Promise.reject({
        status: 401,
        msg: "Wrong credentials. Are you signed up?",
      });
    }
  }
}
async function userLogOut() {
  try {
    const user = auth.currentUser;
    const accessKey = user.accessToken;
    if (accessKey) {
      await signOut(auth);
      return "User logged out";
    }
  } catch (error) {
    return error;
  }
}
async function changeAccountDetails(firstName, lastName) {
  try {
    console.log(firstName, lastName);
    const user = auth.currentUser;
    const accessKey = user.accessToken;
    if (accessKey) {
      const fbUid = user.uid;

      const findUser = await User.find({ fbUid: fbUid });

      if (findUser) {
        const filter = { fbUid: fbUid };
        const updatedUser = await User.findOneAndUpdate(filter, {
          userFirstName: firstName,
          userLastName: lastName,
        });
        console.log(updatedUser, "from model line 123");
        return updatedUser;
      }
    }
  } catch (error) {
    return Promise.reject({
      status: 401,
      msg: "You need to be logged in to change your details",
    });
  }
}
async function changeAccountCredentials() {
  try {
  } catch (error) {}
} //In progress

//=================== [  BOOK MODELS  ] ===================//

async function fetchBooks() {
  try {
    const books = await Book.find({});
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
    const reviews = await Review.find({ bookId: book_id });
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
    const uid = user.uid;
    const accessKey = user.accessToken;

    if (accessKey) {
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
        uid: uid,
      });
      await review.save();
      await updateBookRating(book_id);
      return review;
    }
  } catch (error) {
    return Promise.reject({
      status: 401,
      msg: "You need to be logged in to leave a review",
    });
  }
}

async function removeReviewById(review_id) {
  try {
    const user = auth.currentUser;
    const accessKey = user.accessToken;
    if (accessKey) {
      const uid = user.uid;
      const findReview = await Review.findById(review_id);
      if (!findReview) {
        return Promise.reject({ status: 404, msg: "Review not found" });
      }
      if (findReview.uid !== uid) {
        return Promise.reject({
          status: 401,
          msg: "You are not allowed to delete other user's reviews",
        });
      }
      const bookId = findReview.bookId;
      const deletedReview = await Review.findByIdAndDelete(review_id);
      await updateBookRating(bookId);
      return deletedReview;
    }
  } catch (error) {
    if (error.kind === "ObjectId") {
      return Promise.reject({ status: 400, msg: "Invalid review Id" });
    } else {
      return Promise.reject({
        status: 401,
        msg: "You need to be logged in to delete a review",
      });
    }
  }
}

async function amendReviewById(review_id, reviewBody, rating) {
  try {
    const user = auth.currentUser;
    const accessKey = user.accessToken;

    if (accessKey) {
      const uid = user.uid;

      const findReview = await Review.findById(review_id);
      if (!findReview) {
        return Promise.reject({ status: 404, msg: "Review not found" });
      }
      if (findReview.uid !== uid) {
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
      return updatedReview;
    }
  } catch (error) {
    if (error.kind === "ObjectId") {
      return Promise.reject({ status: 400, msg: "Invalid review Id" });
    } else {
      return Promise.reject({
        status: 401,
        msg: "You need to be logged in to modify a review",
      });
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
      basket.items.push({ product: productId, quantity: quantity });
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

async function removeFromBasketById(book_id){
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
    if (!basket) {
      return Promise.reject({ status: 404, msg: "Shopping cart not found" });
    }
    basket.items.forEach(item => {

      if (item.product.toString() === book_id) {
        const bookIndexToDelete = basket.items.indexOf(item);
        basket.items.splice(bookIndexToDelete, 1);
      }
      else { 
        throw(new Error("Not found"));
      }
    });
    await basket.save();
  } catch (error) {
    if (error.message === "Not found"){
      return Promise.reject({
        status: 404,
        msg: "Book not found",
      });
    }
  }
}

module.exports = {
  saveNewUser,
  userLogIn,
  userLogOut,
  changeAccountDetails,
  removeUserProfile,
  fetchBooks,
  fetchBookById,
  sendBookReview,
  fetchReviewsByBookId,
  removeReviewById,
  amendReviewById,
  createBasket,
  sendToBasket,
  removeFromBasketById
};
