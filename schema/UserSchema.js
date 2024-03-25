import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  user: String,
  userName: String,
  bio: String,
});

const User = model("User", userSchema);

export default User;
