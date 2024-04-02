const dropColletions = require("../seed/dropCollections");
const restoreCollections = require("./restoreCollections");

async function runSeed() {
  try {
    await dropColletions();

    await restoreCollections();
  } catch (error) {
    console.log("🔴 ~ runSeed ~ error:", error);
  } finally {
    console.log("🌱 ~ Seeding has finished succesfully.");
  }
}

module.exports = runSeed;
