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
        userFirstName: "Josh",
        userLastName: "Taylor",
        userEmail: "yojet41754@rartg.com",
      });

      const createdUser = {
        userFirstName: "Josh",
        userLastName: "Taylor",
        userEmail: "yojet41754@rartg.com",
      };
      expect(response.statusCode).toBe(201);
      expect(response.body.user).toMatchObject(createdUser);
    });

    test("400 ~ Returns a warning message when user omits setting up a password.", async () => {
      const response = await request(app).post("/api/create_account").send({
        userFirstName: "Samantha",
        userLastName: "Montoya",
        userEmail: "montoya_samy@gmail.com",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("Password is required to sign up");
    });
    test("400 ~ Returns a warning message when user omits setting up a email address.", async () => {
      const response = await request(app).post("/api/create_account").send({
        password: "test123",
        userFirstName: "Samantha",
        userLastName: "Montoya",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("Email is required to sign up");
    });

    test("400 ~ Returns a warning message when user submits an empty sign up form.", async () => {
      const response = await request(app).post("/api/create_account").send({});
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe(
        "Looks like some fields are missing! Please fill out all required fields to complete your sign-up."
      );
    });

    test("400 ~ Returns a warning message when user signing up with an email that has been already authenticathed.", async () => {
      const response = await request(app).post("/api/create_account").send({
        password: "test123",
        userFirstName: "Hikari",
        userLastName: "Miyazaki",
        userEmail: "johna29841@is2w.cashbenties.com",
      });
      expect(response.statusCode).toBe(400);
    });
  });
  describe("DELETE /api/delete_account", () => {
    test("200 ~ Returns the deleted object", async () => {
      const password = "test123";
      const userEmail = "yojet41754@rartg.com";
      await userLogIn(userEmail, password);
      const response = await request(app).delete("/api/delete_account");
      expect(response.statusCode).toBe(200);
    });
  });
  describe("POST /api/sign_in", () => {
    test("200 ~ Returns a 'Logged in!' message when successfully logged in.", async () => {
      const response = await request(app).post("/api/sign_in").send({
        email: "lohobi3577@acname.com",
        password: "test123",
      });
      const toMatch = { userEmail: "lohobi3577@acname.com", msg: "Logged in!" };
      expect(response.statusCode).toBe(200);
      expect(response.body.loggedIn);
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

  describe("PATCH /api/account_details", () => {
    test("200 ~ Returns the updated user info object.", async () => {
      await dropCollections();
      await restoreColletions();
      const email = "lohobi3577@acname.com";
      const password = "test123";
      await userLogIn(email, password);
      const response = await request(app).patch("/api/account_details").send({
        userFirstName: "Mango",
        userLastName: "Cafe",
      });
      expect(response.statusCode).toBe(200);
    });
    test("401 ~ Users need to be logged in to be able to modify their personal details", async () => {
      await dropCollections();
      await restoreColletions();
      await userLogOut();
      const response = await request(app).patch("/api/account_details").send({
        userFirstName: "Mango",
        userLastName: "Cafe",
      });
      expect(response.statusCode).toBe(401);
    });
  });
  describe.skip("PATCH /api/change_password", () => {
    test("200 ~ Users can change their log in credentials.", async () => {
      const email = "koxoqybu@closetab.email";
      const password = "TEST!@#";
      await userLogIn(email, password);

      const response = await request(app).patch("/api/change_password").send({
        // currentPassword: "test1234",
        // newPassword: "TEST!@#",
        // confirmPassword: "TEST!@#",
      });
      expect(response.body.msg).toBe("Password has been updates successfully!");
      expect(response.statusCode).toBe(200);
    });
  });
  describe.skip("PATCH /api/change_email", () => {
    test("200 ~ Users can change their log in credentials.", async () => {
      const email = "eph73342@aw5f.cashbenties.com";
      const password = "test123";
      const user = await userLogIn(email, password);
      const response = await request(app).patch("/api/change_email").send({
        newEmailAddress: "eph73342@aw5f.cashbenties.com",
      });

      expect(response.body.msg).toBe(
        "Check your email inbox and click on the verification link to finish the update"
      );
    });
  });
  describe("POST /api/sign_out", () => {
    test("200 ~ Responds with a 'User logged out' message on successful log in.", async () => {
      const email = "lohobi3577@acname.com";
      const password = "test123";
      await userLogIn(email, password);
      const response = await request(app).post("/api/sign_out").send({});
      expect(response.statusCode).toBe(200);
      expect(response.body.msg).toBe("User logged out");
    });
    test.skip("400 ~ Responds with a 'Opps, you are not logged in!'message on successful log in.", async () => {
      await userLogOut();
      const response = await request(app).post("/api/sign_out").send({});
      expect(response.body.msg).toBe("Opps, you are not logged in!");
      expect(response.statusCode).toBe(400);
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
        "/api/reviews/660f2648fe68600fce64dc5b"
      );
      expect(response.statusCode).toBe(200);
      expect(response.body.reviews).toBeInstanceOf(Array);
    });
    test("200 ~ Each review object structure is according to the data model.", async () => {
      await dropCollections();
      await restoreColletions();
      const response = await request(app).get(
        "/api/reviews/660f2648fe68600fce64dc5b"
      );
      const reviews = response.body.reviews;

      reviews.forEach((review) => {
        expect(review).toHaveProperty("_id", expect.any(String)),
          expect(review).toHaveProperty("bookId", expect.any(String)),
          expect(review).toHaveProperty("userName", expect.any(String)),
          expect(review).toHaveProperty("fbUid", expect.any(String)),
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
      const email = "johna29841@is2w.cashbenties.com";
      const password = "test123";
      await userLogIn(email, password);
      const toMatch = {
        bookId: "660f2648fe68600fce64dc67",
        userName: "Amelia Rodriguez",
        fbUid: "7ARfMmM4G6fnBDACzGKQmMskV383",
        reviewBody: "Art as Experience is a wonderful book!",
        createdAt: expect.any(String),
        rating: 5,
        _id: expect.any(String),
        __v: 0,
      };

      const response = await request(app)
        .post("/api/reviews/660f2648fe68600fce64dc67")
        .send({
          reviewBody: "Art as Experience is a wonderful book!",
          rating: 5,
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.review).toMatchObject(toMatch);
    });

    test("201 ~ Users can review multiple books.", async () => {
      await dropCollections();
      await restoreColletions();
      const email = "johna29841@is2w.cashbenties.com";
      const password = "test123";
      await userLogIn(email, password);
      const toMatch = {
        bookId: "660f2648fe68600fce64dc6d",
        userName: "Amelia Rodriguez",
        fbUid: "7ARfMmM4G6fnBDACzGKQmMskV383",
        reviewBody: "Not great, not terrible",
        createdAt: expect.any(String),
        rating: 3,
        _id: expect.any(String),
        __v: 0,
      };

      const response = await request(app)
        .post("/api/reviews/660f2648fe68600fce64dc6d")
        .send({
          reviewBody: "Not great, not terrible",
          rating: 3,
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.review).toMatchObject(toMatch);
    });

    test("400 ~ Users cannot add more than one review per book.", async () => {
      await dropCollections();
      await restoreColletions();
      const email = "johna29841@is2w.cashbenties.com";
      const password = "test123";
      await userLogIn(email, password);
      const response = await request(app)
        .post("/api/reviews/660f2648fe68600fce64dc5b")
        .send({
          reviewBody: "Not great, not terrible",
          rating: 3,
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("You cannot review this item again");
    });
    test("400 ~ Responds with a 'Cannot send a review without a rating' message if rating value is missing in the post request body.", async () => {
      await dropCollections();
      await restoreColletions();
      const email = "johna29841@is2w.cashbenties.com";
      const password = "test123";
      await userLogIn(email, password);
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
      await userLogOut();
      const response = await request(app)
        .post("/api/reviews/660f2648fe68600fce64dc6e")
        .send({
          reviewBody: "Art as Experience is a wonderful book!",
          rating: 5,
        });
      expect(response.statusCode).toBe(401);
      expect(response.body.msg).toBe(
        "You need to be logged in to leave a review"
      );
    });
    test("404 ~ Returns a 'Book to review was not found' message if book is non-existent in database.", async () => {
      await dropCollections();
      await restoreColletions();
      const email = "johna29841@is2w.cashbenties.com";
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
      const email = "johna29841@is2w.cashbenties.com";
      const password = "test123";
      await userLogIn(email, password);
      const response = await request(app).delete(
        "/api/reviews/6616c11043f0029e992cc600"
      );
      const objectToMatch = {
        _id: "6616c11043f0029e992cc600",
        bookId: "660f2648fe68600fce64dc5b",
        userName: "Amelia Rodriguez",
        reviewBody:
          "Great book for those new to medieval philosophy. Explains the key concepts in a clear and concise way. Would benefit from including some primary sources though.",
        createdAt: "2024-04-10T16:40:48.978Z",
        rating: 4,
        __v: 0,
      };

      expect(response.statusCode).toBe(200);
      expect(response.body.deletedReview).toMatchObject(objectToMatch);
    });
    test("400 ~ Retruns a 'Invalid review id' message when invalid resource identifier provided.", async () => {
      await dropCollections();
      await restoreColletions();
      const email = "johna29841@is2w.cashbenties.com";
      const password = "test123";
      await userLogIn(email, password);
      const response = await request(app).delete("/api/reviews/ddd");
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe("Invalid review Id");
    });
    test("401 ~ Users are not allowed to delete other user's reviews.", async () => {
      await dropCollections();
      await restoreColletions();
      const email = "johna29841@is2w.cashbenties.com";
      const password = "test123";
      await userLogIn(email, password);
      const response = await request(app).delete(
        "/api/reviews/6616c10f43f0029e992cc5eb"
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
        "/api/reviews/6616c10f43f0029e992cc5eb"
      );
      expect(response.statusCode).toBe(401);
      expect(response.body.msg).toBe(
        "You need to be logged in to delete a review"
      );
    });
    test("404 ~ Returns a 'Review not found' message when providing an id for a non-existent book review.", async () => {
      await dropCollections();
      await restoreColletions();
      const email = "johna29841@is2w.cashbenties.com";
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

      const email = "hybipedo@citmo.net";
      const password = "test123";
      await userLogIn(email, password);

      const toMatch = {
        _id: "6616c575c3d614ea715bb40c",
        bookId: "660f2648fe68600fce64dc5f",
        userName: "Sakura Nakamura",
        fbUid: "A0x0iFFXcxaptDqniVeaHYJl7Vz2",
        reviewBody: "Buen plot, buenos personajes",
        createdAt: "2024-04-10T16:59:33.024Z",
        rating: 4,
        __v: 0,
      };
      const response = await request(app)
        .patch("/api/reviews/6616c575c3d614ea715bb40c")
        .send({ reviewBody: "Buen plot, buenos personajes", rating: 4 });
      expect(response.statusCode).toBe(200);
      expect(response.body.updatedReview).toMatchObject(toMatch);
    });
    test("200 ~ Users are able to update review body only.", async () => {
      await dropCollections();
      await restoreColletions();

      const toMatch = {
        _id: "6616c575c3d614ea715bb40c",
        bookId: "660f2648fe68600fce64dc5f",
        userName: "Sakura Nakamura",
        fbUid: "A0x0iFFXcxaptDqniVeaHYJl7Vz2",
        reviewBody: "El dia de ayer llovio musho!",
        createdAt: "2024-04-10T16:59:33.024Z",
        rating: 4,
        __v: 0,
      };
      const response = await request(app)
        .patch("/api/reviews/6616c575c3d614ea715bb40c")
        .send({ reviewBody: "El dia de ayer llovio musho!" });

      expect(response.statusCode).toBe(200);
      expect(response.body.updatedReview).toMatchObject(toMatch);
    });
    test("200 ~ Users are able to update review rating only.", async () => {
      await dropCollections();
      await restoreColletions();
      const toMatch = {
        _id: "6616c575c3d614ea715bb40c",
        bookId: "660f2648fe68600fce64dc5f",
        userName: "Sakura Nakamura",
        fbUid: "A0x0iFFXcxaptDqniVeaHYJl7Vz2",
        reviewBody: "Informative and thought-provoking. A must-read.",
        createdAt: "2024-04-10T16:59:33.024Z",
        rating: 3,
        __v: 0,
      };
      const response = await request(app)
        .patch("/api/reviews/6616c575c3d614ea715bb40c")
        .send({ rating: 3 });
      expect(response.statusCode).toBe(200);
      expect(response.body.updatedReview).toMatchObject(toMatch);
    });
    test("200 ~ When sending an empty request body, changes are not made", async () => {
      await dropCollections();
      await restoreColletions();

      const toMatch = {
        _id: "6616c575c3d614ea715bb40c",
        bookId: "660f2648fe68600fce64dc5f",
        userName: "Sakura Nakamura",
        fbUid: "A0x0iFFXcxaptDqniVeaHYJl7Vz2",
        reviewBody: "Informative and thought-provoking. A must-read.",
        createdAt: "2024-04-10T16:59:33.024Z",
        rating: 4,
        __v: 0,
      };
      const response = await request(app)
        .patch("/api/reviews/6616c575c3d614ea715bb40c")
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
        .patch("/api/reviews/6616c68dff9bbe693138bcd7")
        .send({});
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
