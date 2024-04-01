function customErrorHandler(error, request, response, next) {
  if (error.status === 400 && error.msg === "Username is required") {
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
  } else if (error.status === 400 && error.msg === "This book hasn't been reviewed yet") {
    response.status(400).send({ msg: "This book hasn't been reviewed yet"});
  }
}

module.exports = { customErrorHandler };
