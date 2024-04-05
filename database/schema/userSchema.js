const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  fbUid: String,
  userName: String,
  userEmail: String,
  userBio: { type: String, default: "No user bio found" },
  profileImg: String,
  basketId: { type: Schema.Types.ObjectId }
});

const User = model("User", userSchema);

module.exports = User;
