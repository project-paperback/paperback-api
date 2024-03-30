# Paperback API

This API is the foundation for the Paperback project. In this repository you will find the the functionalities of the backend, endpoints and more.

## Installation

Clone this repository by running the following command on your terminal:

```
git clone https://github.com/AlfredoGvz/paperback.git
```

Once cloned, get into the root directory of the project and run the following command on the terminal to install the node modules:

```
npm install
```

### Tools and packages

The following section is a description of the tools used and how to install them individually. All of them are included in this project already and will work once you install the node modules. See the **Installation** section if in doubt about how to install the node modules.

**Firebase**  
Firebase allowed this project to add authentication functionalities. It also provided storage services to upload images for user profile.

The [Firebase documentation](https://firebase.google.com/docs/build) provides a clear guidance on authentication and storage services.

Installation of Firebase:

```
npm install firebase
```

**Database**  
This project uses MongoDB as primary database. Other services were used to store images, like Firebase storage. To know more about them, go to the relevant sections and find links to documentation.

To install MongoDB run the following command on your terminal:

```
npm install mongodb
```

You will need to install mongoose to interact and query the database:

```
npm install mongoose --save
```

**Testing**  
For testing this project uses jest. Additionally, supertest is required.

Install jest witht the following command:

```
npm install --save-dev jest
```

To get supertest, use the following command:

```
npm install supertest --save-dev
```

Follow these links to access the relevant documentation:

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest on NPM](https://www.npmjs.com/package/supertest)

#### Summary of tools

| Tool       | Description                                          | Installation                       |
| :--------- | :--------------------------------------------------- | :--------------------------------- |
| Express js | Framework for building APIs                          | `npm install express`              |
| MongoDB    | Database                                             | `npm install mongodb`              |
| Mongoose   | Interface for interacting with MongoDB database      | `npm install mongoose --save`      |
| Firebase   | Backend application development platforms            | `npm install firebase`             |
| Multer     | Node.js middleware for handling multipart/form-data  | `npm install --save multer`        |
| Jest       | A JavaScript Testing Framework                       | `npm install --save-dev jest`      |
| Supertest  | A JavaScript HTTP client for Node.js and the browser | `npm install supertest --save-dev` |
