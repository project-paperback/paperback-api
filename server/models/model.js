// const mongoose = require("mongoose");
const {
  auth,
  newUser,
  signIn,
  deleteUser,
} = require("../../Firebase/Manage_Users/FBauthentication.js");
const { Book, Review, User } = require("../../database/schema/schemaIndex.js");
const {
  ref,
  storage,
  getDownloadURL,
  uploadBytesResumable,
} = require("../../Firebase/firebaseStorage/fbStorage.js");
const { connectToDb } = require("../../database/connection/dbConnection.js");
connectToDb();
const { updateBookRating } = require("../utilities/utils.js");

/*


*/

async function saveNewUser(password, email, userName, userBio, req) {
  try {
    if (!userName) {
      return Promise.reject({ status: 400, msg: "Username is required" });
    } else if (!password) {
      return Promise.reject({ status: 400, msg: "Password is required" });
    } else if (!email) {
      return Promise.reject({ status: 400, msg: "Email is required" });
    }

    const addUser = await newUser(auth, email, password);

    let downloadURL = "Profile picture not set up.";
    if (req.file) {
      const imagesRef = ref(
        storage,
        `profileImages/${
          req.file.originalname +
          addUser.user.uid +
          Math.ceil(Math.random() * 1000)
        }`
      );
      const buffer = req.file.buffer;
      const metadata = { contentType: req.file.mimetype };
      const uploadTask = uploadBytesResumable(imagesRef, buffer, metadata);
      const snapshot = await uploadTask;
      downloadURL = await getDownloadURL(snapshot.ref);
    }

    const newUserMongo = new User({
      fbUid: addUser.user.uid,
      userName: userName,
      userBio: userBio,
      userEmail: addUser.user.email,
      profileImg: downloadURL,
    });
    await newUserMongo.save();
    return newUserMongo;
  } catch (error) {
    return error.customData._tokenResponse.error;
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
      console.log("🚀 ~ userLogIn ~ error:", error);
      return Promise.reject({
        status: 401,
        msg: "Wrong credentials. Are you signed up?",
      });
    }
  }
}

async function removeUserProfile() {
  try {
    const user = auth.currentUser;
    const userInfo = user.reloadUserInfo;
    const fireUid = userInfo.localId;
    const userToRemove = await User.find({ fbUid: fireUid });
    const userId = userToRemove[0]._id;
    const userRemoved = await User.findByIdAndDelete(userId);

    await deleteUser(user);

    return userRemoved;
  } catch (error) {}
}
//====================================================================
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
      return { status: 400, message: "Invalid request parameters" }; // Adjust message as needed
    } else {
      console.log(error); // Log other errors
      // You can throw the error again for further handling (optional)
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

async function sendBookReview(book_id, userName, reviewBody, rating) {
  try {
    if (!userName) {
      return Promise.reject({ status: 400, msg: "Missing username" });
    } else if (!rating) {
      return Promise.reject({ status: 400, msg: "Missing rating" });
    }
    const isBookInCollection = await Book.findById(book_id);

    if (isBookInCollection === null) {
      return Promise.reject({ status: 404, msg: "Book to review not found" });
    }

    const reviewsInCollection = await Review.find({ userName: userName });
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
    });
    await review.save();

    await updateBookRating(book_id);

    return review;
  } catch (error) {
    console.log("🚀 ~ sendBookReview ~ error:", error);
  }
}

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

async function removeReviewById(review_id) {
  try {
    const findReview = await Review.findById(review_id);
    if (!findReview) {
      return Promise.reject({ status: 404, msg: "Review not found" });
    }
    const bookId = findReview.bookId;
    const deletedReview = await Review.findByIdAndDelete(review_id);
    await updateBookRating(bookId);
    return deletedReview;
  } catch (error) {
    console.log(error);
  }
}

async function amendReviewById(review_id, reviewBody, rating) {
  try {
    const findReview = await Review.findById(review_id);
    if (!findReview) {
      return Promise.reject({ status: 404, msg: "Review not found" });
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
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  saveNewUser,
  userLogIn,
  removeUserProfile,
  fetchBooks,
  fetchBookById,
  sendBookReview,
  fetchReviewsByBookId,
  removeReviewById,
  amendReviewById,
};
