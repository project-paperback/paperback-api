const app = require("../fbConnection/fbConnection");
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser,
} = require("firebase/auth");

const auth = getAuth(app);
const newUser = createUserWithEmailAndPassword;
const signIn = signInWithEmailAndPassword;

module.exports = {
  app,
  auth,
  newUser,
  signIn,
  deleteUser,
};
