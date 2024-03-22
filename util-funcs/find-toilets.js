const axios = require('axios');
const { cities } = require('../data/test-data/cities');

async function findToilets() {
    try {
        let allToiletsData = [];

        for (const city of cities) {
            const { name, latitude, longitude } = city;
            console.log(city, '<<< each city object');

            const info = await axios.get(
                "https://www.refugerestrooms.org/api/v1/restrooms/by_location",
                {
                    params: {
                        lat: city.latitude,
                        lng: city.longitude,
                        page: 1,
                        per_page: 25,
                        offset: 0,
                    },
                }
            );

            const toiletsData = info.data;
            console.log(toiletsData, '<<<<< each city data in the populate func');

            allToiletsData = allToiletsData.concat(toiletsData);
            console.log(allToiletsData);
        }

        console.log('All toilets data fetched:', allToiletsData);
        return allToiletsData;
    } catch (err) {
        console.error("Error", err);
    }
}


module.exports = findToilets;
