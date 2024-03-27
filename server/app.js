const express = require("express");
const { getBooks, postNewUser, getBookById } = require("./controllers/controller");
const { customErrorHandler } = require("./errorHandling/customErrors");
const app = express();

app.use(express.json());

app.post("/api/create_user", postNewUser);

app.get("/api/books", getBooks);
app.get("/api/books/:book_id", getBookById)

app.use(customErrorHandler);
module.exports = app;
