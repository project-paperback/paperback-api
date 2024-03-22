const { MongoClient } = require("mongodb");
const ENV = process.env.NODE_ENV || "development";
console.log(ENV, "<<<< the current ENV");
require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

module.exports = client;
