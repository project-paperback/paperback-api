const { fetchBooks } = require("../models/model")

async function getBooks(req, res){
    const books = await fetchBooks()
    res.status(200).send({books : books})
}

module.exports = {getBooks}