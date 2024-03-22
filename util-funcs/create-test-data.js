const fs = require("fs").promises
const findToilets = require('./find-toilets')

async function createTestData() {
  try {
    const allToiletsData = await findToilets()
    await fs.writeFile('toilets.json', JSON.stringify(allToiletsData, null, 2));
    console.log('All toilets data written to toilets.json');
} catch (err) {
    console.error("Error", err);       
}
}

createTestData() // doesnt need to be exported, invoke it here if we lose the test data
    