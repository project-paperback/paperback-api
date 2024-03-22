const client = require('../server/connection');
const fs = require('fs');
const jsonData = require('../data/test-data/all-toilets.json');
const Toilet = require('../data/schema/toilet-schema');

async function seedTestData() {
  try {
    
      const db = client.db();
      
      await client.connect();
      
      await db.collection('testToilets').drop().then(() => {
        console.log('db dropped');
      })

    const formattedDataArray = jsonData.map(obj => ({
      refuge_id: obj.id,
      name: obj.name,
      street: obj.street,
      city: obj.city,
      country: obj.country,
      unisex: obj.unisex,
      changing_table: obj.changing_table,
      accessible: obj.accessible,
      comment: obj.comment,
      latitude: obj.latitude,
      longitude: obj.longitude,
      distance: obj.distance,
    }));

    const result = await db.collection('testToilets').insertMany(formattedDataArray);
    console.log(`${result.insertedCount} toilets inserted successfully.`);
    
    await client.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

module.exports = seedTestData


