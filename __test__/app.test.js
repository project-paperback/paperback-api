const app = require("../server/app");
const request = require("supertest");
const client = require("../server/connection");
const seedTestData = require('../util-funcs/seed-test-data')

beforeEach(() => {
  return client.connect()
  .then(() => {
    console.log(`connected to : ${client.options.dbName}`);
  })
})
afterAll(() => {
  return client.close();
});
beforeAll(() => {
  seedTestData()
  })

describe("API FLUSHME", () => {
  describe("GET /api/cities", () => {
    test("200 - should response with the cities array with the correct information", () => {
      return request(app)
        .get("/api/cities")
        .expect(200)
        .then(({ _body }) => {
          const { cities } = _body 
          // console.log(cities)
          expect(cities.length).toBe(10)
          cities.forEach((city) => {
              expect(city).toHaveProperty("_id", expect.any(String)),
              expect(city).toHaveProperty("latitude", expect.any(Number)),
              expect(city).toHaveProperty("longitude", expect.any(Number)),
              expect(city).toHaveProperty("name", expect.any(String)),
              expect(city).toHaveProperty("display_name", expect.any(String)),
              expect(city).toHaveProperty("__v", expect.any(Number));
              expect(cities[0]).toEqual(
                expect.objectContaining({
                    _id: '65d278858bd0d5a142920a77',
                    latitude: 53.4794892,
                    longitude: -2.2451148,
                    name: 'Manchester',
                    display_name: 'Manchester, Greater Manchester, England, United Kingdom',
                    __v: 0
                    })
                )})
            });
          });

    test('404- Returns message of "Not Found" if request URL is misspelled.', () => {
      return request(app)
        .get("/api/citieeeeeees")
        .expect(404)
        .then(({ res }) => {
          expect(res.statusMessage).toBe("Not Found");
        });
    });
    /* RESEARCH HOW TO CONTROL URL QUERY PARAMTERS AS A DEFAULT
    test('400 - Returns a bad request if invalid query paramters were given', () => {
      return request(app)
        .get("/api/cities?invalid=123")
        .expect(400)
        .then(({ res }) => {
          expect(res.statusMessage).toBe("Bad Request");
          console.log(res.body);
        });
    });*/
  });
  
  describe("GET /api/:city_name/toilets", () => {
    test("200- Returns an aray with information.", () => {
      return request(app)
        .get("/api/manchester/toilets")
        .then(({ _body }) => {
          const { cityToilets } = _body  
          console.log(cityToilets)        
          expect(cityToilets).toBeInstanceOf(Array);
          expect(cityToilets[0]).toEqual(
            expect.objectContaining({
            _id: "65d278858bd0d5a142920a77",
            latitude: 53.4794892,
            longitude: -2.2451148,
            name: "Manchester",
            display_name: "Manchester, Greater Manchester, England, United Kingdom",
            __v: 0,
            toilets: expect.any(Array),
            }))
        });
    });
    test("404- Returns a message of 'Not Found' if city is not in database.", () => {
      return request(app)
        .get("/api/tachileik/toilets")
        .expect(404)
        .then(({body}) => {
          expect(body.message).toBe('City not found in database')
        });
    });
  });
});
