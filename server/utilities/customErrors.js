function customErrorHandler(error, request, response, next) {
  // console.log("🚀 ~ customErrorHandler ~ error:", error);
  if (error.status === 200 && error.msg === "More books coming soon!") {
    response.status(200).send({ msg: "More books coming soon!" });
  } else if (error.status === 400 && error.msg === "Username is required") {
    response.status(400).send({ msg: "Username is required" });
  } else if (error.status === 400 && error.msg === "Password is required") {
    response.status(400).send({ msg: "Password is required" });
  } else if (error.code === 400 && error.message === "EMAIL_EXISTS") {
    response.status(400).send({ msg: "Email already in use" });
  } else if (
    error.status === 400 &&
    error.msg === "You cannot review this item again"
  ) {
    response.status(400).send({ msg: "You cannot review this item again" });
  } else if (error.status === 400 && error.msg === "Invalid book id") {
    response.status(400).send({ msg: "Invalid book id" });
  } else if (error.status === 400 && error.msg === "Missing rating") {
    response.status(400).send({ msg: "Cannot send a review without a rating" });
  } else if (error.status === 400 && error.msg === "Missing username") {
    response
      .status(400)
      .send({ msg: "Cannot send a review without a username" });
  } else if (error.status === 404 && error.msg === "Book not found") {
    response.status(404).send({ msg: "Book not found" });
  }
}

module.exports = customErrorHandler;
