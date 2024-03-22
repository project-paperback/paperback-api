const axios = require("axios");
const { cities } = require("../data/test-data/cities");
const client = require("../server/connection");
const fs = require("fs").promises;
const db = client.db();

client.connect().then(() => {
  console.log("we are connected to the db");
});

async function populateToiletsInCities() {
  try {
    let allToiletsData = [];
    for (const city of cities) {
      const { name, latitude, longitude } = city;
      console.log(city, "<<< each city object");
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
      console.log(toiletsData, "<<<<< each city data in the populate func");

      // Concatenate current city's toilet data with allToiletsData array
      allToiletsData = allToiletsData.concat(toiletsData);
    }

    // Write allToiletsData to toilets.json file
    await fs.writeFile("toilets.json", JSON.stringify(allToiletsData, null, 2));
    console.log("All toilets data written to toilets.json");
  } catch (err) {
    console.error("Error", err);
  }
}

populateToiletsInCities();

// for (const toilet of toiletsData) {
//     const existingToilet = await db.collection('toilets').findOne({ id: toilet.id });
//     console.log(existingToilet);
// }

//         if (existingToilet) {
//             // Update existing toilet
//             await Toilet.findByIdAndUpdate(existingToilet._id, {
//                 name: toiletData.name,
//                 street: toiletData.street,
//                 city: toiletData.city,
//                 country: toiletData.country,
//                 unisex: toiletData.unisex,
//                 changing_table: toiletData.changing_table,
//                 comment: toiletData.comment,
//                 latitude: toiletData.latitude,
//                 longitude: toiletData.longitude,
//                 distance: toiletData.distance,
//                 accessible: toiletData.accessible
//             });
//             console.log("Toilet updated:", toiletData.name);
//         } else {
//             // Create new toilet
//             await Toilet.create({
//                 refuge_id: toiletData.id,
//                 name: toiletData.name,
//                 street: toiletData.street,
//                 city: toiletData.city,
//                 country: toiletData.country,
//                 unisex: toiletData.unisex,
//                 changing_table: toiletData.changing_table,
//                 comment: toiletData.comment,
//                 latitude: toiletData.latitude,
//                 longitude: toiletData.longitude,
//                 distance: toiletData.distance,
//                 accessible: toiletData.accessible
//             });
//             console.log("New toilet created:", toiletData.name);
//         }
//     }
// }
//  catch (err) {
// console.error("Error", err);
// }
