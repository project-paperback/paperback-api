const Toilet = require('../data/schema/toilet-schema');
const client = require('../server/connection');
const findToilets = require('../util-funcs/find-toilets');

async function patchToilets() {
    try {
        await client.connect();
        console.log('Connected to the database.');

        const db = client.db();
        const toiletsCollection = db.collection('toilets')

        const toiletsData = await findToilets();
        
        let updatedCount = 0;
        let createdCount = 0;

        for (const toiletData of toiletsData) {
            const existingToilet = await toiletsCollection.findOne({ refuge_id: toiletData.id });

            if (existingToilet) {
                await toiletsCollection.updateOne({ refuge_id: toiletData.id }, {
                    $set: {
                        name: toiletData.name,
                        street: toiletData.street,
                        city: toiletData.city,
                        country: toiletData.country,
                        unisex: toiletData.unisex,
                        changing_table: toiletData.changing_table,
                        accessible: toiletData.accessible,
                        comment: toiletData.comment,
                        latitude: toiletData.latitude,
                        longitude: toiletData.longitude,
                        distance: toiletData.distance,
                    }
                });

                updatedCount++;
            } else {
                await toiletsCollection.insertOne({
                    refuge_id: toiletData.id,
                    name: toiletData.name,
                    street: toiletData.street,
                    city: toiletData.city,
                    country: toiletData.country,
                    unisex: toiletData.unisex,
                    changing_table: toiletData.changing_table,
                    accessible: toiletData.accessible,
                    comment: toiletData.comment,
                    latitude: toiletData.latitude,
                    longitude: toiletData.longitude,
                    distance: toiletData.distance,
                });

                createdCount++;
            }
        }

        console.log(`Updated ${updatedCount} toilets.`);
        console.log(`Created ${createdCount} new toilets.`);

        console.log('All toilets data processed.');
        await client.close();
        console.log('Disconnected from the database.');
    } catch (err) {
        console.error("Error", err);
    }
}
patchToilets()

module.exports = patchToilets;
