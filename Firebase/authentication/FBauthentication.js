const app = require("../fbConnection/fbConnection");
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = require("firebase/auth");

const auth = getAuth(app);
const newUser = createUserWithEmailAndPassword;

module.exports = {
  app,
  auth,
  newUser,
};
