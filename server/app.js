const cors = require("cors");
const express = require("express");
const app = express();
const {
  fetchingCities,
  fetchingCityToilets,
} = require("./controllers/controllers");
app.use(cors());

app.get("/api/cities", fetchingCities);
app.get("/api/:city_name/toilets", fetchingCityToilets);

app.use((err, req, res, next) => {
  if (err.status === 404 && err.msg === "City not found") {
    res.status(404).send({ msg: "City not found" });
  }
});

// client.connect().then(() => {
//   console.log(`Connected to MongoDB database: ${client.s.options.dbName}`);
// })
// .then(() => {
//   client.close()
//   console.log('Client closed successfully');
// });

module.exports = app;
