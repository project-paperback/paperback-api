const request = require("supertest");
const {
  dataBase,
  endConnection,
} = require("../database/connection/dbConnection");
const app = require("../server/app");
const runSeed = require("../database/seed/run-seed");
const dropCollections = require("../database/seed/dropCollections");
const restoreColletions = require("../database/seed/restoreCollections");

beforeAll(async () => {
  return await dataBase();
});

// beforeEach(async () => {
//   return await runSeed();
// });
afterAll(() => {
  return endConnection();
});

describe("PAPERBACK API", () => {
  describe("GET /api/books", () => {
    test("200 ~ Returns an array of book objects.", async () => {
      await dropCollections();
      await restoreColletions();
      const response = await request(app).get("/api/books");

      expect(response.statusCode).toBe(200);
      expect(response.body.books).toBeInstanceOf(Array);
    });
    test("200 ~ Returns a 'More books coming soon!' message when right endpoint but no items available", async () => {
      await dropCollections();
      const response = await request(app).get("/api/books");
      expect(response.statusCode).toBe(200);
      expect(response.body.msg).toBe("More books coming soon!");
    });

    test("200 ~ Each object structure is according to the data model.", async () => {
      await dropCollections();
      await restoreColletions();
      const response = await request(app).get("/api/books");
      expect(response.statusCode).toBe(200);
      const books = response.body.books;

      books.forEach((book) => {
        expect(book).toHaveProperty("_id", expect.any(String));
        expect(book).toHaveProperty("title", expect.any(String));
        expect(book).toHaveProperty("author", expect.any(String));
        expect(book).toHaveProperty("year", expect.any(Number));
        expect(book).toHaveProperty("pages", expect.any(Number));
        expect(book).toHaveProperty(
          "genres",
          expect.any(Array, expect.any(String))
        );
        expect(book).toHaveProperty("isFiction", expect.any(Boolean));
        expect(book).toHaveProperty("publisher", expect.any(String));
        expect(book).toHaveProperty("isbn", expect.any(Number));
        expect(book).toHaveProperty("qty", expect.any(Number));
        expect(book).toHaveProperty("rating", expect.any(Number));
      });
    });
    //Test the negative path later
    // test.only("404 ~ Returns a 'No books found' if enpoint is valid but not in the expected format.", () => {
    //   return request(app)
    //     .get("/api/book")
    //     .expect(404)
    //     .then(({ body }) => {
    //       console.log("🚀 ~ .then ~ body:", body);

    //       expect(body.msg).toBe("No books found");
    //     });
    // });
  });
  describe("GET /api/books/book_id", () => {
    test("200 ~ Returns the corresponding book object given a book id.", async () => {
      await dropCollections();
      await restoreColletions();
      const matchingItem = {
        _id: "6602968a7b60b6e6e3b6a9fd",
        title: "To the Lighthouse",
        author: "Virginia Woolf",
        year: 1927,
        pages: 209,
        genres: ["Computer Science", "Textbook"],
        language: "English",
        isFiction: true,
        publisher: "Hogarth Press",
        isbn: 9780156907392,
        qty: 4,
        rating: 0,
        __v: 0,
      };

      const response = await request(app).get(
        "/api/books/6602968a7b60b6e6e3b6a9fd"
      );
      expect(response.statusCode).toBe(200);
      expect(response.body.book).toMatchObject(matchingItem);
    });
    test("400 ~ Returns a 'Invalid book id' message if invalid book id.", async () => {
      await dropCollections();
      await restoreColletions();
      const response = await request(app).get("/api/books/dddd");
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("Invalid book id");
    });
    test("404 ~ Returns a 'Book not found' message when given an id of a non-existent item in database.", async () => {
      await dropCollections();
      await restoreColletions();

      const response = await request(app).get(
        "/api/books/66029a552fc9fc1d38e0fd4b"
      );
      expect(response.statusCode).toBe(404);
      expect(response.body.msg).toBe("Book not found");
    });
  });
  describe("GET /api/reviews/book_id", () => {
    test("200 ~ Returns an array of reviews objects", async () => {
      await dropCollections();
      await restoreColletions();
      const response = await request(app).get(
        "/api/reviews/6602968a7b60b6e6e3b6a9c9"
      );
      expect(response.statusCode).toBe(200);
      expect(response.body.reviews).toBeInstanceOf(Array);
    });
    test("200 ~ Each review object structure is according to the data model.", async () => {
      await dropCollections();
      await restoreColletions();
      const response = await request(app).get(
        "/api/reviews/6602968a7b60b6e6e3b6a9c9"
      );
      const reviews = response.body.reviews;

      reviews.forEach((review) => {
        expect(review).toHaveProperty("_id", expect.any(String)),
          expect(review).toHaveProperty("bookId", expect.any(String)),
          expect(review).toHaveProperty("userName", expect.any(String)),
          expect(review).toHaveProperty("reviewBody", expect.any(String)),
          expect(review).toHaveProperty("createdAt", expect.any(String)),
          expect(review).toHaveProperty("rating", expect.any(Number));
      });
    });
    test("200 ~ Returns a 'This book hasn't been reviewed yet' message if book has no reviews.", async () => {
      await dropCollections();
      await restoreColletions();
      const response = await request(app).get(
        "/api/reviews/6602968a7b60b6e6e3b6a9cb"
      );

      expect(response.statusCode).toBe(200);
      expect(response.body.msg).toBe("This book hasn't been reviewed yet");
    });
    test("400 ~ Returns a 'Invalid book id' message when the input is an invalid book id format.", async () => {
      await dropCollections();
      await restoreColletions();
      const response = await request(app).get("/api/reviews/ddd");
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("Invalid book id");
    });
    test("404 ~ Returns a 'Book was not found' message if book id of a non-existent item in database", async () => {
      await dropCollections();
      await restoreColletions();

      const response = await request(app).get(
        "/api/reviews/66029a552fc9fc1d38e0fd49"
      );
      expect(response.statusCode).toBe(404);
      expect(response.body.msg).toBe("Book not found");
    });
  });

  describe("POST /api/reviews/book_id", () => {
    test("201 ~ Returns the posted review object back.", async () => {
      await dropCollections();
      await restoreColletions();

      const toMatch = {
        bookId: "6602968a7b60b6e6e3b6a9cb",
        userName: "Mario",
        reviewBody: "Nice book ",
        createdAt: expect.any(String),
        rating: 2,
      };

      const response = await request(app)
        .post("/api/reviews/6602968a7b60b6e6e3b6a9cb")
        .send({
          bookId: "6602968a7b60b6e6e3b6a9cb",
          userName: "Mario",
          reviewBody: "Nice book ",
          rating: 2,
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.review).toMatchObject(toMatch);
    });
    test("400 ~ Users cannot add more than one review per book.", async () => {
      await dropCollections();
      await restoreColletions();
      const response = await request(app)
        .post("/api/reviews/6602968a7b60b6e6e3b6a9cb")
        .send({
          bookId: "6602968a7b60b6e6e3b6a9c9",
          userName: "Spiderman",
          reviewBody: "What a terrible book! Not a masterpiece.",
          rating: 3,
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("You cannot review this item again");
    });
    test("400 ~ Responds with a 'Cannot send a review without a username' message when username is missing in the post request body.", async () => {
      await dropCollections();
      await restoreColletions();
      const response = await request(app)
        .post("/api/reviews/6602968a7b60b6e6e3b6a9cb")
        .send({
          bookId: "6602968a7b60b6e6e3b6a9cb",
          reviewBody: "Nice book ",
          rating: 2,
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("Cannot send a review without a username");
    });
    test("400 ~ Responds with a 'Cannot send a review without a rating' message if rating value is missing in the post request body.", async () => {
      await dropCollections();
      await restoreColletions();

      const response = await request(app)
        .post("/api/reviews/6602968a7b60b6e6e3b6a9cb")
        .send({
          bookId: "6602968a7b60b6e6e3b6a9cb",
          userName: "Superman",
          reviewBody: "What a terrible book! Not a masterpiece.",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("Cannot send a review without a rating");
    });

    test("404 ~ Returns a 'Book to review was not found' message if book is non-existent in database.", async () => {
      await dropCollections();
      await restoreColletions();

      const response = await request(app)
        .post("/api/reviews/66029a552fc9fc1d38e0fd4b")
        .send({
          userName: "Superman",
          reviewBody: "What a terrible book! Not a masterpiece.",
          rating: 3,
        });
      expect(response.statusCode).toBe(404);
      expect(response.body.msg).toBe("Book to review not found");
    });
  });
  describe("DELETE /api/reviews/review_id", () => {
    test("200 ~ Returns the deleted review object.", async () => {
      await dropCollections();
      await restoreColletions();

      const response = await request(app).delete(
        "/api/reviews/66059d1222d02d34b58e0664"
      );
      const objectToMatch = {
        _id: "66059d1222d02d34b58e0664",
        bookId: "6602968a7b60b6e6e3b6a9c9",
        userName: "Spiderman",
        reviewBody: "What a terrible book! Not a masterpiece.",
        createdAt: "2024-03-28T16:38:42.462Z",
        rating: 3,
        __v: 0,
      };
      expect(response.statusCode).toBe(200);
      expect(response.body.deletedReview).toMatchObject(objectToMatch);
    });
  });
});
