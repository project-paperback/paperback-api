const express = require("express");
const { getBooks } = require("./controllers/controller");
const app = express();


app.get('/api/books', getBooks)

module.exports = app