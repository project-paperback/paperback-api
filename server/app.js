const express = require("express");
const { getBooks, postNewUser } = require("./controllers/controller");
const { customErrorHandler } = require("./errorHandling/customErrors");
const app = express();

app.use(express.json());

app.post("/api/create_user", postNewUser);

app.get("/api/books", getBooks);
app.use(customErrorHandler);
module.exports = app;
