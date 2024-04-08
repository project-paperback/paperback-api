const mongoose = require("mongoose");
const Book = require("../database/schema/bookSchema.js");
const fs = require("fs").promises;
const { connectToDb } = require("../database/connection/dbConnection.js");

const bookData = require("../info_books.json");
const { connectToDb } = require("../database/connection/dbConnection.js");

async function saveBooks() {
  try {
    await connectToDb(); // Await connection completion
    await Book.insertMany(bookData);

    mongoose.connection.close(); // Close connection after completion
    console.log("Books updated");
  } catch (error) {
    console.error("Error:", error);
  }
}

// saveBooks();

// function filterData() {
//   const filtered = bookData.filter((book) => {
//     return book.publisher;
//   });
//   fs.writeFile(
//     "database/seed/jsonData/bookData.json",
//     JSON.stringify(filtered)
//   );
// }
// filterData();
