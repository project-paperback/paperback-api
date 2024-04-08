function customErrorHandler(error, request, response, next) {
  console.log(error, "from error handler line 2");
  if (error.status === 200) {
    if (error.msg === "More books coming soon!") {
      response.status(200).send({ msg: "More books coming soon!" });
    } else if (error.msg === "This book hasn't been reviewed yet") {
      response.status(200).send({ msg: "This book hasn't been reviewed yet" });
    }
  } else if (error.status === 400) {
    if (error.msg === "Email and password missing") {
      response.status(400).send({ msg: "Email and password missing" });
    } else if (error.msg === "Email required to log in") {
      response.status(400).send({ msg: "Email required to log in" });
    } else if (error.msg === "Password required to log in") {
      response.status(400).send({ msg: "Password required to log in" });
    } else if (error.msg === "You cannot review this item again") {
      response.status(400).send({ msg: "You cannot review this item again" });
    } else if (error.msg === "Invalid book id") {
      response.status(400).send({ msg: "Invalid book id" });
    } else if (error.msg === "Missing rating") {
      response
        .status(400)
        .send({ msg: "Cannot send a review without a rating" });
    } else if (error.msg === "Missing username") {
      response
        .status(400)
        .send({ msg: "Cannot send a review without a username" });
    } else if (error.msg === "Invalid review Id") {
      response.status(400).send({ msg: "Invalid review Id" });
    } else if(error.msg === "Invalid book Id, input must be a 24 character hex string, 12 byte Uint8Array, or an integer"){
      response.status(400).send({ msg: "Invalid book Id, input must be a 24 character hex string, 12 byte Uint8Array, or an integer"})
    }
  } else if (error.status === 401) {
    if (error.msg === "Wrong credentials. Are you signed up?") {
      response
        .status(401)
        .send({ msg: "Wrong credentials. Are you signed up?" });
    } else if (error.msg === "Unauthorized request") {
      response.status(401).send({ msg: "Unauthorized request" });
    } else if (error.msg === "You need to be logged in to leave a review") {
      response
        .status(401)
        .send({ msg: "You need to be logged in to leave a review" });
    } else if (error.msg === "You need to be logged in to delete a review") {
      response
        .status(401)
        .send({ msg: "You need to be logged in to delete a review" });
    } else if (
      error.msg === "You are not allowed to delete other user's reviews"
    ) {
      response
        .status(401)
        .send({ msg: "You are not allowed to delete other user's reviews" });
    } else if (error.msg === "You need to be logged in to modify a review") {
      response
        .status(401)
        .send({ msg: "You need to be logged in to modify a review" });
    } else if (
      error.msg === "You are not allowed to modify other user's reviews"
    ) {
      response
        .status(401)
        .send({ msg: "You are not allowed to modify other user's reviews" });
    } else if(error.msg === "You need to be logged in to add items to the basket"){
      response.status(401).send({ msg: "You need to be logged in to add items to the basket"})
    }
  } else if (error.status === 404) {
    if (error.msg === "Book to review not found") {
      response.status(404).send({ msg: "Book to review not found" });
    } else if (error.msg === "Book not found") {
      response.status(404).send({ msg: "Book not found" });
    } else if (error.msg === "Review not found") {
      response.status(404).send({ msg: "Review not found" });
    } else if (error.msg === "Book not found") {
      response.status(404).send({ msg: "Book not found" });
    } else if (error.msg === "Shopping cart not found"){
      response.status(404).send({ msg: "Shopping cart not found"})
    }
  }
}

module.exports = customErrorHandler;
