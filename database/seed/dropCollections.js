const { testDb, endConnection } = require("../connection/dbConnection");
const Book = require("../schema/BookSchema");

testDb();
async function books() {
  try {
    const result = await Book.find({});
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
  } finally {
    endConnection();
  }
}

books();
