const mongoose = require("mongoose");
const Book = require("../../schema/BookSchema.js")

mongoose.connect(
    "mongodb+srv://riccardofoti97:9DjR06YkoRabUZcS@bookshop.wtlyola.mongodb.net/development?retryWrites=true&w=majority&appName=BookShop"
);

async function fetchBooks(){
    try {
        const books = await Book.find({})
        return books
    } catch (error) {
        console.log(error)
    } finally {
        mongoose.connection.close()
    }
}

module.exports = {fetchBooks}