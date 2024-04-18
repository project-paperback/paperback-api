const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  fbUid: String,
  userFirstName: String,
  userLastName: String,
  userEmail: String,
  basketId: { type: Schema.Types.ObjectId },
  shoppingHistoryId: { type: Schema.Types.ObjectId },
});
const User = model("User", userSchema);

module.exports = User;
