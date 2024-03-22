const mongoose = require("mongoose");

const toiletSchema = new mongoose.Schema({
  refuge_id: Number,
  name: String,
  street: String,
  city: String,
  country: String,
  unisex: Boolean,
  changing_table: Boolean,
  accessible: Boolean,
  comment: String, 
  latitude: Number,
  longitude: Number,
  distance: Number,
});
module.exports = mongoose.model("Toilet", toiletSchema);
