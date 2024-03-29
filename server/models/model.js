const mongoose = require("mongoose");
const {
  auth,
  newUser,
} = require("../../Firebase/authentication/FBauthentication.js");
const { Book, Review, User } = require("../../schema/schemaIndex.js");
const {
  ref,
  storage,
  getDownloadURL,
  uploadBytesResumable,
} = require("../../Firebase/firebaseStorage/fbStorage.js");
mongoose.connect(
  "mongodb+srv://riccardofoti97:9DjR06YkoRabUZcS@bookshop.wtlyola.mongodb.net/development?retryWrites=true&w=majority&appName=BookShop"
);

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
    console.log(downloadURL);

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
    return books;
  } catch (error) {
    console.log(error);
  }
}

async function fetchBookById(id) {
  try {
    const book = await Book.findById(id);
    return book;
  } catch (error) {
    console.log(error);
  }
}

async function sendBookReview(book_id, userName, reviewBody, rating) {
  try {
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

    // Get all the reviews
    const allReviews = await Review.find({ bookId: book_id });
    let ratingsSum = 0;
    const aggregate = allReviews.forEach(
      (review) => (ratingsSum += review.rating)
    );

    const ratingAverage = ratingsSum / allReviews.length;
    const averageResult = Number(ratingAverage.toFixed(1));
    // get the book by id
    await Book.findByIdAndUpdate(book_id, { $set: { rating: averageResult } });

    return review;
  } catch (error) {}
}

async function fetchReviewsById(book_id){
  try {
    const reviews = await Review.find({ bookId: book_id })
    if (reviews.length === 0) {
      return Promise.reject({ status: 400, msg: "This book hasn't been reviewed yet" });
    }
    return reviews
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  fetchBooks,
  saveNewUser,
  fetchBookById,
  sendBookReview,
  fetchReviewsById
};
