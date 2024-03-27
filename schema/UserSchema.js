const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  fbUid: String,
  userName: String,
  userEmail: String,
  userBio: String,
});

const User = model("User", userSchema);

module.exports = User;
