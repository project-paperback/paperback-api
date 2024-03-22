const { getCities, getCityToilets } = require("../models/models");

function fetchingCities(request, response, next) {
  getCities().then((data) => {
    response.status(200).send({ cities: data });
  });
}

function fetchingCityToilets(request, response, next) {
  const { city_name } = request.params;
  getCityToilets(city_name)
    .then((data) => {
      response.status(200).send({ cityToilets: data });
    })
    .catch((err) => {
      if(err.message === "City not found in database") {
        response.status(404).send({message: 'City not found in database'})
      }
      else {
        response.status(500).send({message: 'Internal server error'})
      }

    });
}

module.exports = { fetchingCities, fetchingCityToilets };
