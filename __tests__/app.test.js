const request = require("supertest");
const {
  connectToDb,
  endConnection,
} = require("../database/connection/dbConnection");
const app = require("../server/app");

const dropCollections = require("../database/seed/dropCollections");
const restoreColletions = require("../database/seed/restoreCollections");
const { userLogIn, userLogOut } = require("../server/models/model");

beforeAll(async () => {
  return await connectToDb();
});
afterAll(() => {
  return endConnection();
});

describe("PAPERBACK API", () => {
  describe("POST /api/create_account", () => {
    test("201 ~ Returns the newly created user object.", async () => {
      const response = await request(app).post("/api/create_account").send({
        password: "test123",
        userName: "Samantha Montoya",
        email: "samy_montoya@gmail.com",
        image: "",
      });

      const createdUser = {
        fbUid: expect.any(String),
        userName: "Samantha Montoya",
        userEmail: "samy_montoya@gmail.com",
        userBio: "No user bio found",
        profileImg: "Profile picture not set up.",
        _id: expect.any(String),
        __v: 0,
      };
      expect(response.statusCode).toBe(201);
      expect(response.body.user).toMatchObject(createdUser);
    });

    test("400 ~ Returns a 'Password is required' message when user omits setting up a password.", async () => {
      const response = await request(app).post("/api/create_account").send({
        userName: "Tomas",
        email: "codersharp@gmail.com",
        image: "/home/natsu/Downloads/firebase.png",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("Password is required");
    });
    test("400 ~ Returns a 'Email is required' message when user omits setting up a email address.", async () => {
      const response = await request(app).post("/api/create_account").send({
        userName: "Tomas",
        password: "test123",
        image: "/home/natsu/Downloads/firebase.png",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("Email is required");
    });
    test("400 ~ Returns a 'Email is required' message when user omits setting up a email address.", async () => {
      const response = await request(app).post("/api/create_account").send({
        email: "coderSharp@gmail.com",
        password: "test123",
        image: "/home/natsu/Downloads/firebase.png",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("Username is required");
    });
    test("400 ~ Returns a 'Email already in use' message when user signing up with an existent email in database.", async () => {
      const response = await request(app).post("/api/create_account").send({
        password: "test123",
        userName: "Tomas",
        email: "coder@gmail.com",
        image: "/home/natsu/Downloads/firebase.png",
      });
      expect(response.statusCode).toBe(400);
    });
  });
  describe("DELETE /api/delete_account", () => {
    test("200 ~ Returns the deleted object", async () => {
      const response = await request(app).delete("/api/delete_account");

      expect(response.statusCode).toBe(200);
    });
  });
  describe("POST /api/sign_in", () => {
    test.only("200 ~ Returns a 'Logged in!' message when successfully logged in.", async () => {
      const email = "evilcapy@gmail.com";
      const password = "test123";
      await userLogIn(email, password);
      const response = await request(app).patch("/api/account_details").send({
        userName: "Hernan Cortez",
        userBio:
          "Spanish conquistador who led a daring expedition that toppled the Aztec Empire in the early 16th century. 🗡️  🔥",
      });
      expect(response.statusCode).toBe(200);
      console.log(response, "from test 92");
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

  describe.only("PATCH /api/account_details", () => {
    test("200 ~ Returns the updated user info object.", async () => {});
  });
  describe("POST /api/sign_out", () => {
    test("200 ~ Responds with a 'User logged out' message on successful log in.", async () => {
      const response = await request(app).post("/api/sign_out").send({});
      expect(response.statusCode).toBe(200);
      expect(response.body.msg).toBe("User logged out");
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
        "/api/reviews/660f2648fe68600fce64dc5a"
      );
      expect(response.statusCode).toBe(200);
      expect(response.body.reviews).toBeInstanceOf(Array);
    });
    test("200 ~ Each review object structure is according to the data model.", async () => {
      await dropCollections();
      await restoreColletions();
      const response = await request(app).get(
        "/api/reviews/660f2648fe68600fce64dc5a"
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
        "/api/reviews/660f2648fe68600fce64dc6d"
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
      const email = "evilcapy@gmail.com";
      const password = "test123";
      await userLogIn(email, password);
      const response = await request(app)
        .post("/api/reviews/660f2648fe68600fce64dc5f")
        .send({
          reviewBody: `This book is a delightful surprise! It perfectly blends the history and science behind sugar confectionery.  Learned fascinating facts about the connection to pharmaceuticals and the artistry of traditional candy making. A must-read for any candy enthusiast. `,
          rating: 5,
        });

      expect(response.statusCode).toBe(201);
      // expect(response.body.review).toMatchObject(toMatch);
    });
    test("201 ~ Users can review multiple books.", async () => {
      await dropCollections();
      await restoreColletions();
      const toMatch = {
        bookId: "660f2648fe68600fce64dc5e",
        userName: "Evil Capybara",
        reviewBody: "Nice book ",
        createdAt: expect.any(String),
        rating: 2,
        _id: expect.any(String),
        __v: 0,
      };
      const email = "evilcapy@gmail.com";
      const password = "test123";
      await userLogIn(email, password);
      const response = await request(app)
        .post("/api/reviews/660f2648fe68600fce64dc5e")
        .send({
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
        .post("/api/reviews/660f2648fe68600fce64dc5a")
        .send({
          userName: "geenos",
          reviewBody: "What a nice book",
          rating: 4,
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("You cannot review this item again");
    });
    test.skip("400 ~ Responds with a 'Cannot send a review without a username' message when username is missing in the post request body.", async () => {
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
    test("401 ~ Users can only submit a book review if they are logged in.", async () => {
      await dropCollections();
      await restoreColletions();
      await dropCollections();
      await restoreColletions();
      await userLogOut();
      const response = await request(app)
        .post("/api/reviews/660f2648fe68600fce64dc5a")
        .send({
          userName: "Mario",
          reviewBody: "Nice book ",
          rating: 2,
        });
      expect(response.statusCode).toBe(401);
      expect(response.body.msg).toBe(
        "You need to be logged in to leave a review"
      );
    });
    test("404 ~ Returns a 'Book to review was not found' message if book is non-existent in database.", async () => {
      await dropCollections();
      await restoreColletions();
      const email = "evilcapy@gmail.com";
      const password = "test123";
      await userLogIn(email, password);
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
      const email = "evilcapy@gmail.com";
      const password = "test123";
      await userLogIn(email, password);
      const response = await request(app).delete(
        "/api/reviews/661258af59baa9d7b15fd448"
      );
      const objectToMatch = {
        _id: "661258af59baa9d7b15fd448",
        bookId: "660f2648fe68600fce64dc5a",
        userName: "Evil Capybara",
        reviewBody: "I love the perspective from which the topic is explored",
        createdAt: "2024-04-07T08:26:23.141Z",
        rating: 5,
        __v: 0,
      };

      expect(response.statusCode).toBe(200);
      expect(response.body.deletedReview).toMatchObject(objectToMatch);
    });
    test("400 ~ Retruns a 'Invalid review id' message when invalid resource identifier provided.", async () => {
      await dropCollections();
      await restoreColletions();
      const response = await request(app).delete("/api/reviews/ddd");
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("Invalid review Id");
    });
    test("401 ~ Users are not allowed to delete other user's reviews.", async () => {
      await dropCollections();
      await restoreColletions();
      const response = await request(app).delete(
        "/api/reviews/661258eb7ed8f1e4f03771bc"
      );
      expect(response.statusCode).toBe(401);
      expect(response.body.msg).toBe(
        "You are not allowed to delete other user's reviews"
      );
    });
    test("401 ~ Users can only delete a review if logged in.", async () => {
      await dropCollections();
      await restoreColletions();
      await userLogOut();
      const response = await request(app).delete(
        "/api/reviews/660f2f5f5ad029846d6db8e0"
      );
      expect(response.statusCode).toBe(401);
      expect(response.body.msg).toBe(
        "You need to be logged in to delete a review"
      );
    });
    test("404 ~ Returns a 'Review not found' message when providing an id for a non-existent book review.", async () => {
      await dropCollections();
      await restoreColletions();
      const email = "coder123@gmail.com";
      const password = "test123";
      await userLogIn(email, password);
      const response = await request(app).delete(
        "/api/reviews/660f2648fe68600fce64dc5a"
      );
      expect(response.statusCode).toBe(404);
      expect(response.body.msg).toBe("Review not found");
    });
  });
  describe("PATCH /api/reviews/review_id", () => {
    test("200 ~ Responds with the updated review object.", async () => {
      await dropCollections();
      await restoreColletions();

      const email = "hmiyazaki@gmail.com";
      const password = "test123";
      await userLogIn(email, password);

      const toMatch = {
        _id: "661258eb7ed8f1e4f03771bc",
        bookId: "660f2648fe68600fce64dc5a",
        userName: "Hikari Miyazaki",
        uid: "7IXJboyfUKN7P8snTGZl7zErreo1",
        reviewBody: "Buen plot, buenos personajes",
        createdAt: "2024-04-07T08:27:23.518Z",
        rating: 4,
        __v: 0,
      };
      const response = await request(app)
        .patch("/api/reviews/661258eb7ed8f1e4f03771bc")
        .send({ reviewBody: "Buen plot, buenos personajes", rating: 4 });
      expect(response.statusCode).toBe(200);
      expect(response.body.updatedReview).toMatchObject(toMatch);
    });
    test("200 ~ Users are able to update review body only.", async () => {
      await dropCollections();
      await restoreColletions();

      const toMatch = {
        _id: "661258eb7ed8f1e4f03771bc",
        bookId: "660f2648fe68600fce64dc5a",
        userName: "Hikari Miyazaki",
        uid: "7IXJboyfUKN7P8snTGZl7zErreo1",
        reviewBody: "El dia de aller llovio mucho.",
        createdAt: "2024-04-07T08:27:23.518Z",
        rating: 5,
        __v: 0,
      };
      const response = await request(app)
        .patch("/api/reviews/661258eb7ed8f1e4f03771bc")
        .send({ reviewBody: "El dia de aller llovio mucho." });

      expect(response.statusCode).toBe(200);
      expect(response.body.updatedReview).toMatchObject(toMatch);
    });
    test("200 ~ Users are able to update review rating only.", async () => {
      await dropCollections();
      await restoreColletions();
      const toMatch = {
        _id: "661258eb7ed8f1e4f03771bc",
        bookId: "660f2648fe68600fce64dc5a",
        userName: "Hikari Miyazaki",
        uid: "7IXJboyfUKN7P8snTGZl7zErreo1",
        reviewBody: "I love this author in general",
        createdAt: "2024-04-07T08:27:23.518Z",
        rating: 3,
        __v: 0,
      };
      const response = await request(app)
        .patch("/api/reviews/661258eb7ed8f1e4f03771bc")
        .send({ rating: 3 });
      expect(response.statusCode).toBe(200);
      expect(response.body.updatedReview).toMatchObject(toMatch);
    });
    test("200 ~ When sending an empty request body, changes are not made", async () => {
      await dropCollections();
      await restoreColletions();
      const toMatch = {
        _id: "661258eb7ed8f1e4f03771bc",
        bookId: "660f2648fe68600fce64dc5a",
        userName: "Hikari Miyazaki",
        uid: "7IXJboyfUKN7P8snTGZl7zErreo1",
        reviewBody: "I love this author in general",
        createdAt: "2024-04-07T08:27:23.518Z",
        rating: 5,
        __v: 0,
      };
      const response = await request(app)
        .patch("/api/reviews/661258eb7ed8f1e4f03771bc")
        .send({});
      expect(response.statusCode).toBe(200);
      expect(response.body.updatedReview).toMatchObject(toMatch);
    });
    test("400 ~ Returns a 'Invalid review id' message when the input is an invalid book id format.", async () => {
      await dropCollections();
      await restoreColletions();
      const response = await request(app).patch("/api/reviews/ddd").send({});
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("Invalid review Id");
    });
    test("401 ~ Users are not allowed to modify other user's reviews.", async () => {
      await dropCollections();
      await restoreColletions();
      const response = await request(app)
        .patch("/api/reviews/661258af59baa9d7b15fd448")
        .send({
          reviewBody: "Buen plot, buenos personajes",
          rating: 4,
        });
      expect(response.statusCode).toBe(401);
      expect(response.body.msg).toBe(
        "You are not allowed to modify other user's reviews"
      );
    });
    test("401 ~ Users can only modify a review if they are logged in.", async () => {
      await dropCollections();
      await restoreColletions();
      await userLogOut();
      const response = await request(app)
        .patch("/api/reviews/660f2f405ad029846d6db8da")
        .send({});
      expect(response.statusCode).toBe(401);
      expect(response.body.msg).toBe(
        "You need to be logged in to modify a review"
      );
    });
  });
});
