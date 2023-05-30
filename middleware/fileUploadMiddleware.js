const multer = require('multer');
const fs = require('fs');

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = 'public/uploads'; // Specify the desired destination folder
      fs.mkdirSync(uploadDir, { recursive: true }); // Create the destination folder if it doesn't exist
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + '-' + file.originalname); // Use a unique filename to avoid conflicts
    },
  }),
});

module.exports = {
  upload: upload,
};