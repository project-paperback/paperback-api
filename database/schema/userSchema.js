const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  fbUid: String,
  userName: String,
  userEmail: String,
  userBio: { type: String, default: "No user bio found" },
  profileImg: String,
});

const User = model("User", userSchema);

module.exports = User;
