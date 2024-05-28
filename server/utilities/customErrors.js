function customErrorHandler(error, request, response, next) {
  console.log(error, "from error handler line 2");
  //==================== [ 200 CASES ] ====================//
  if (error.status === 200) {
    if (error.msg === "More books coming soon!") {
      response.status(200).send({ msg: "More books coming soon!" });
    } else if (error.msg === "This book hasn't been reviewed yet") {
      response.status(200).send({ msg: "This book hasn't been reviewed yet" });
    }
  }

  //==================== [ 400 ERRORS ] ====================//
  if (error.status === 400) {
    //Sign in
    if (error.msg === "Email and password missing") {
      response.status(400).send({ msg: "Email and password missing" });
    } else if (error.msg === "Email required to log in") {
      response.status(400).send({ msg: "Email required to log in" });
    } else if (error.msg === "Password required to log in") {
      response.status(400).send({ msg: "Password required to log in" });
    }

    //sign up
    if (error.msg === "Password is required to sign up") {
      response.status(400).send({ msg: "Password is required to sign up" });
    } else if (error.msg === "Name and last name are required to sign up") {
      res
        .status(400)
        .send({ msg: "Name and last name are required to sign up" });
    } else if (error.msg === "Email is required to sign up") {
      response.status(400).send({ msg: "Email is required to sign up" });
    } else if (error.msg === "Name and last name are required to sign up") {
      response
        .status(400)
        .send({ msg: "Name and last name are required to sign up" });
    } else if (error.msg === "Looks like some details are missing") {
      response.status(400).send({
        msg: "Looks like some details are missing",
      });
    } else if (error.msg === "EMAIL_EXISTS") {
      response.status(400).send({ msg: "Email already in use" });
    }
    //Log out
    if (error.msg === "Opps, you are not logged in!") {
      response.status(400).send({ msg: "Opps, you are not logged in!" });
    }
    //Password update
    if (error.msg === "The passwords you entered don't match") {
      response.status(400).send({
        msg: "The passwords you entered don't match. Please re-enter your current password and try again.",
      });
    }
    //reviews
    if (error.msg === "You cannot review this item again") {
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
    } else if (
      error.msg ===
      "Invalid book Id, input must be a 24 character hex string, 12 byte Uint8Array, or an integer"
    ) {
      response.status(400).send({
        msg: "Invalid book Id, input must be a 24 character hex string, 12 byte Uint8Array, or an integer",
      });
    }
    //checkout
    if (error.msg === "Item not available") {
      response.status(400).send({ msg: "Item not available" });
    }
    //basket
    if (error.msg === "Item exceeding maximum orderable amount") {
      response
        .status(400)
        .send({ msg: "Item exceeding maximum orderable amount" });
    } else if (error.msg === "Item not in shopping cart") {
      response.status(400).send({ msg: "Item not in shopping cart" });
    } else if (error.msg === "Cannot go below 1") {
      response.status(400).send({ msg: "Cannot go below 1" });
    } else if (error.msg === "Please provide a quantity") {
      response.status(400).send({ msg: "Please provide a quantity" });
    } else if (error.msg === "Please provide a quantity between 1 and 99") {
      response.status(400).send({
        msg: "Please provide a quantity between 1 and 99",
      });
    }
  }

  //==================== [ 401 ERRORS ] ====================//
  //Sign in
  if (error.status === 401) {
    if (error.msg === "Wrong credentials. Are you signed up?") {
      response
        .status(401)
        .send({ msg: "Wrong credentials. Are you signed up?" });
    }
    //Patch users
    if (error.msg === "You need to be logged in to change your details") {
      response
        .status(401)
        .send({ msg: "You need to be logged in to change your details" });
    }

    //Password update
    if (
      error.msg === "You need to be logged in to change your password details"
    ) {
      response.status(401).send({
        msg: "You need to be logged in to change your password details",
      });
    }
    //Reviews
    if (error.msg === "Unauthorized request") {
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
    }

    //Basket
    if (error.msg === "You need to be logged in to add items to the basket") {
      response
        .status(401)
        .send({ msg: "You need to be logged in to add items to the basket" });
    } else if (
      error.msg === "You need to be logged in to remove items from the basket"
    ) {
      response.status(401).send({
        msg: "You need to be logged in to remove items from the basket",
      });
    } else if (error.msg === "You need to be logged in to access your basket") {
      response
        .status(401)
        .send({ msg: "You need to be logged in to access your basket" });
    } else if (
      error.msg === "You need to be logged in to change the quantity of an item"
    ) {
      response.status(401).send({
        msg: "You need to be logged in to change the quantity of an item",
      });
    }
  }

  //==================== [ 404 ERRORS ] ====================//
  if (error.status === 404) {
    if (error.msg === "Book to review not found") {
      response.status(404).send({ msg: "Book to review not found" });
    } else if (error.msg === "Book not found") {
      response.status(404).send({ msg: "Book not found" });
    } else if (error.msg === "Review not found") {
      response.status(404).send({ msg: "Review not found" });
    } else if (error.msg === "Book not found") {
      response.status(404).send({ msg: "Book not found" });
    } else if (error.msg === "Shopping cart not found") {
      response.status(404).send({ msg: "Shopping cart not found" });
    } else if (error.msg === "No books in the basket") {
      response.status(404).send({ msg: "No books in the basket" });
    }
  }
}

module.exports = customErrorHandler;
