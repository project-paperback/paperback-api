const request = require("supertest");
const {
  connectToDb,
  endConnection,
} = require("../database/connection/dbConnection");
const app = require("../server/app");

const dropCollections = require("../database/seed/dropCollections");
const restoreColletions = require("../database/seed/restoreCollections");

beforeAll(async () => {
  return await connectToDb();
});

afterAll(() => {
  return endConnection();
});

describe("PAPERBACK API", () => {
  describe("POST /api/create_profile", () => {
    test("201 ~ Returns the newly created user object.", async () => {
      const response = await request(app).post("/api/create_profile").send({
        password: "test123",
        userName: "Tomas",
        email: "codersharp@gmail.com",
        image: "/home/natsu/Downloads/firebase.png",
      });

      const createdUser = {
        fbUid: expect.any(String),
        userName: "Tomas",
        userEmail: "codersharp@gmail.com",
        userBio: "No user bio found",
        profileImg: "Profile picture not set up.",
        _id: expect.any(String),
        __v: 0,
      };
      expect(response.statusCode).toBe(201);
      expect(response.body.user).toMatchObject(createdUser);
    });

    test("400 ~ Returns a 'Password is required' message when user omits setting up a password.", async () => {
      const response = await request(app).post("/api/create_profile").send({
        userName: "Tomas",
        email: "codersharp@gmail.com",
        image: "/home/natsu/Downloads/firebase.png",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("Password is required");
    });
    test("400 ~ Returns a 'Email is required' message when user omits setting up a email address.", async () => {
      const response = await request(app).post("/api/create_profile").send({
        userName: "Tomas",
        password: "test123",
        image: "/home/natsu/Downloads/firebase.png",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("Email is required");
    });
    test("400 ~ Returns a 'Email is required' message when user omits setting up a email address.", async () => {
      const response = await request(app).post("/api/create_profile").send({
        email: "coderSharp@gmail.com",
        password: "test123",
        image: "/home/natsu/Downloads/firebase.png",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("Username is required");
    });
    test("400 ~ Returns a 'Email already in use' message when user signing up with an existent email in database.", async () => {
      const response = await request(app).post("/api/create_profile").send({
        password: "test123",
        userName: "Tomas",
        email: "coder@gmail.com",
        image: "/home/natsu/Downloads/firebase.png",
      });
      expect(response.statusCode).toBe(400);
    });
  });
  describe("DELETE /api/delete_profile", () => {
    test("200 ~ Returns the deleted object", async () => {
      const response = await request(app).delete("/api/delete_profile");

      expect(response.statusCode).toBe(200);
    });
  });
  describe("POST /api/sign_in", () => {
    test("200 ~ Returns a 'Logged in!' message when successfully logged in.", async () => {
      const response = await request(app).post("/api/sign_in").send({
        email: "coder123@gmail.com",
        password: "test123",
      });
      expect(response.statusCode).toBe(200);
      expect(response.body.loggedIn.msg).toBe("Logged in!");
    });
    test("200 ~ Response also returns user email and uid.", async () => {
      const response = await request(app).post("/api/sign_in").send({
        email: "coder123@gmail.com",
        password: "test123",
      });
      expect(response.body.loggedIn.userInf).toHaveProperty("email");
    });
    test("400 ~ Returns an 'Email required to log in' message if user attempts to log in without user email input.", async () => {
      const response = await request(app)
        .post("/api/sign_in")
        .send({ password: "test123" });
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("Email required to log in");
    });
    test("400 ~ Returns a 'Password required to log in' message if user attempts to log in without password input.", async () => {
      const response = await request(app).post("/api/sign_in").send({
        email: "bananas@gmail.com",
      });
      expect(response.body.msg).toBe("Password required to log in");
    });
    test("400 ~ Returns an 'Email and password missing' message if both password and email are missing when signing in.", async () => {
      const response = await request(app).post("/api/sign_in").send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("Email and password missing");
    });
    test("401 ~ Returns a 'Wrong credentials. Are you signed up?' message if logging in without previously signed up.", async () => {
      const response = await request(app).post("/api/sign_in").send({
        email: "bananas@gmail.com",
        password: "test123",
      });
      expect(response.statusCode).toBe(401);
      expect(response.body.msg).toBe("Wrong credentials. Are you signed up?");
    });
  });

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
        expect(book).toHaveProperty("_id", expect.any(String)),
          expect(book).toHaveProperty("title", expect.any(String)),
          expect(book).toHaveProperty("authors", expect.any(Array)),
          expect(book).toHaveProperty("publisher", expect.any(String)),
          expect(book).toHaveProperty("publishedDate", expect.any(String)),
          expect(book).toHaveProperty("description", expect.any(String)),
          expect(book).toHaveProperty("industryIdentifiers", expect.any(Array)),
          expect(book).toHaveProperty("pageCount", expect.any(Number)),
          expect(book).toHaveProperty("printType", expect.any(String)),
          expect(book).toHaveProperty("categories", expect.any(Array)),
          expect(book).toHaveProperty("maturityRating", expect.any(String)),
          expect(book).toHaveProperty("allowAnonLogging", expect.any(Boolean)),
          expect(book).toHaveProperty("contentVersion", expect.any(String)),
          expect(book).toHaveProperty("imageLinks", expect.any(Object)),
          expect(book).toHaveProperty("language", expect.any(String)),
          expect(book).toHaveProperty("previewLink", expect.any(String)),
          expect(book).toHaveProperty("infoLink", expect.any(String)),
          expect(book).toHaveProperty(
            "canonicalVolumeLink",
            expect.any(String)
          ),
          expect(book).toHaveProperty("price", expect.any(Number)),
          expect(book).toHaveProperty("quantity", expect.any(Number)),
          expect(book).toHaveProperty("rating", expect.any(Number)),
          expect(book).toHaveProperty("__v", expect.any(Number));
      });
    });
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
        "/api/books/660f2648fe68600fce64dc5a"
      );
      expect(response.statusCode).toBe(200);
      // expect(response.body.book).toMatchObject(matchingItem);
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

  describe.only("POST /api/reviews/book_id", () => {
    test("201 ~ Returns the posted review object back.", async () => {
      await dropCollections();
      await restoreColletions();
      const toMatch = {
        _id: expect.any(String),
        bookId: "660f2648fe68600fce64dc5a",
        userName: "Mario",
        reviewBody: "Nice book ",
        createdAt: expect.any(String),
        rating: 2,
        __v: 0,
      };
      const response = await request(app)
        .post("/api/reviews/660f2648fe68600fce64dc5a")
        .send({
          userName: "Mario",
          reviewBody: "Nice book ",
          rating: 2,
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.review).toMatchObject(toMatch);
    });

    test("201 ~ Users can review multiple books.", async () => {
      await dropCollections();
      await restoreColletions();
      const toMatch = {
        bookId: expect.any(String),
        userName: "Evil Capybara",
        reviewBody: "Nice book ",
        createdAt: expect.any(String),
        rating: 2,
        _id: "660fb088a3896e0e8372d223",
        __v: 0,
      };

      const response = await request(app)
        .post("/api/reviews/660f2648fe68600fce64dc5c")
        .send({
          userName: "Evil Capybara",
          reviewBody: "Nice book ",
          rating: 2,
        });
      console.log(response.body, "from test line 319");
      expect(response.statusCode).toBe(201);
      expect(response.body.review).toMatchObject(toMatch);
    });

    test("400 ~ Users cannot add more than one review per book.", async () => {
      await dropCollections();
      await restoreColletions();
      const response = await request(app)
        .post("/api/reviews/660f2648fe68600fce64dc5a")
        .send({
          userName: "geenos",
          reviewBody: "What a nice book",
          rating: 4,
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
