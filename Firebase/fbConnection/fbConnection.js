const { initializeApp } = require("firebase/app");
const firebaseConfig = {
  apiKey: "AIzaSyAgfO2y1ssCUiWsIRQQhW_O6MsVg0Pdsx4",
  authDomain: "bookstore-578c6.firebaseapp.com",
  projectId: "bookstore-578c6",
  storageBucket: "bookstore-578c6.appspot.com",
  messagingSenderId: "67247830320",
  appId: "1:67247830320:web:9f2e662a9bb09e6cfa04f5",
  measurementId: "G-4LNXW1J8DS",
};

const app = initializeApp(firebaseConfig);

module.exports = app;
