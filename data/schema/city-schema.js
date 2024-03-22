const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  city: String,
  location: String,
});

module.exports = mongoose.model("City", citySchema);