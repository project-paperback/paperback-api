const app = require("../fbConnection/fbConnection");

const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

const storage = getStorage();
const imagesRef = ref(storage, "profileImages");

module.exports = {
  ref,
  storage,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
};
