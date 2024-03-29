const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const middleWareMulter = upload.single("image");

async function uploadImage(req) {
  try {
    const buffer = req.file.buffer;
    const metadata = { contentType: req.file.mimetype };
    const uploadTask = uploadBytesResumable(imagesRef, buffer, metadata);
    const snapshot = await uploadTask;
    // Get download URL after completion
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("Image uploaded to profileImg:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
  }
}

module.exports = {
  middleWareMulter,
  uploadImage,
};
