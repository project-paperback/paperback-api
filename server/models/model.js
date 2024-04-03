// const mongoose = require("mongoose");
const {
  auth,
  newUser,
} = require("../../Firebase/authentication/FBauthentication.js");
const { Book, Review, User } = require("../../database/schema/schemaIndex.js");
const {
  ref,
  storage,
  getDownloadURL,
  uploadBytesResumable,
} = require("../../Firebase/firebaseStorage/fbStorage.js");
const {
  dataBase,
  endConnection,
} = require("../../database/connection/dbConnection.js");
dataBase();
const { updateBookRating } = require("../utilities/utils.js");

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
    const downloadURL = await getDownloadURL(snapshot.ref);

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
    return Promise.reject(error.customData._tokenResponse.error);
  }
}

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
    const bookId = findReview.bookId;
    const deletedReview = await Review.findByIdAndDelete(review_id);
    await updateBookRating(bookId);
    return deletedReview;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  fetchBooks,
  saveNewUser,
  fetchBookById,
  sendBookReview,
  fetchReviewsByBookId,
  removeReviewById,
};
