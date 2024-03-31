const { endConnection } = require("../connection/dbConnection");
const {
  dropBookCollection,
  dropReviewsCollection,
} = require("./dropCollections");
const {
  restoreBookCollection,
  restoreReviewCollection,
} = require("./restoreCollections");

async function runSeed() {
  try {
    await dropBookCollection();
    await dropReviewsCollection();

    await restoreBookCollection();
    await restoreReviewCollection();
  } catch (error) {
    console.log("🔴 ~ runSeed ~ error:", error);
  } finally {
    endConnection();
    console.log("🌱 ~ Seeding has finished succesfully.");
  }
}

runSeed();
