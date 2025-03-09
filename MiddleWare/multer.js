import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {cloudinary} from '../utils/cloudinary.js'
// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define uploads directory path
const uploadsDir = path.join(__dirname, 'uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Define the storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // Specify the destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    const filename = `${file.originalname}`;
    cb(null, filename);

    // Upload to Cloudinary and delete locally
    const filePath = path.join(uploadsDir, filename);
    
    setTimeout(() => {
      cloudinary.uploader.upload(filePath, (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
        } else {
          console.log('Uploaded to Cloudinary:', result.secure_url);
        }

        // Remove file from server
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) console.error('Failed to delete local file:', unlinkErr);
        });
      });
    }, 100);
  }
});

// Export the multer upload instance
export const upload = multer({ storage: storage });
