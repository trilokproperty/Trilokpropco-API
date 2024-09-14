// Middleware setup (multer.js)
import multer from 'multer';

const storage = multer.diskStorage({

  filename: function (req, file, cb) {
    cb(null, file.originalname); // Keep original file name
  }
});

export const upload = multer({ storage: storage });