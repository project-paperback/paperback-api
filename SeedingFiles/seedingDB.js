const mongoose = require("mongoose")
const Book = require("../schema/BookSchema.js")
const fs = require("fs").promises
const dataPromise = fs.readFile("info_books.json", "utf-8")


async function saveBooks() {
  try {
    await mongoose.connect(
      "mongodb+srv://riccardofoti97:9DjR06YkoRabUZcS@bookshop.wtlyola.mongodb.net/development?retryWrites=true&w=majority&appName=BookShop"
    ); // Await connection completion
    const pendingPromise = await dataPromise
    const data = JSON.parse(pendingPromise)
    const promises = data.map(async (book) => {
      const existingBook = await Book.findOne({ title: book.title });
      console.log(existingBook);
      if (existingBook === null) {
        const newBook = new Book({
          // _id: new ObjectId(book._id),
          title: book.title,
          author: book.author,
          year: book.year,
          pages: book.pages,
          genres: book.genres,
          language: book.language,
          isFiction: book.isFiction,
          publisher: book.publisher,
          bookPrice: book.bookPrice,
          isbn: book.isbn,
          qty: book.qty,
        });
        return newBook.save();
      }
    });

    await Promise.all(promises); // Wait for all save operations

    mongoose.connection.close(); // Close connection after completion
    console.log("Books updated");
  } catch (error) {
    console.error("Error:", error);
  }
}

saveBooks();
