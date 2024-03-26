const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  user: String,
  userName: String,
  bio: String,
});

const User = model("User", userSchema);

module.exports = User;
