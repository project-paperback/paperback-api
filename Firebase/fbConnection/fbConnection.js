const { initializeApp } = require("firebase/app");
const ENV = process.env.NODE_ENV || "development";
require("dotenv").config({
  path: `.env.${ENV}`, //Adjust path depending on environment we execute the app
});

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  // storageBucket: "bookstore-578c6.appspot.com",
  // messagingSenderId: "67247830320",
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

module.exports = app;
