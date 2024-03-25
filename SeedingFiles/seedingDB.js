import mongoose from "mongoose";
import data from "../info_books.json" assert { type: "json" };
import Book from "../schema/BookSchema.js";
import User from "../schema/UserSchema.js";

async function saveBooks() {
  try {
    await mongoose.connect(
      "mongodb+srv://agvzprofessionalacc:1IyWNBpgLL5AJhLi@cluster0.bfswy29.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    ); // Await connection completion

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
