const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload.fields([
  { name: "profilePic", maxCount: 1 },
  { name: "verificationImage", maxCount: 1 },
  { name: "cnicFront", maxCount: 1 },
  { name: "cnicBack", maxCount: 1 },
]);