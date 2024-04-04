const mongoose = require("mongoose")
const Book = require("../database/schema/bookSchema.js")
// const fs = require("fs").promises
// const dataPromise = fs.readFile("info_books.json", "utf-8")
const bookData = require("../info_books.json")

async function saveBooks() {
  try {
    await mongoose.connect(
      "mongodb+srv://riccardofoti97:9DjR06YkoRabUZcS@bookshop.wtlyola.mongodb.net/development?retryWrites=true&w=majority&appName=BookShop"
    ); // Await connection completion
    await Book.insertMany(bookData)

    mongoose.connection.close(); // Close connection after completion
    console.log("Books updated");
  } catch (error) {
    console.error("Error:", error);
  }
}

saveBooks();
