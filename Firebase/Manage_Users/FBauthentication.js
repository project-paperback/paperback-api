const app = require("../fbConnection/fbConnection");
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  sendEmailVerification,
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
  updatePassword,
} = require("firebase/auth");

const auth = getAuth(app);
const newUser = createUserWithEmailAndPassword;
const signIn = signInWithEmailAndPassword;

module.exports = {
  app,
  auth,
  newUser,
  signIn,
  signOut,
  deleteUser,
  sendEmailVerification,
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
  updatePassword,
};
