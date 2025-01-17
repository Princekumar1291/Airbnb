// cloudinaryConfig.js

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'du6squ4z0',
  api_key: '463417433416289',
  api_secret: 'NyJgf4Kpgoey2yVfdbM_yQNDyPg',
});

// Set up Multer to use Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'housePhotos', // Folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], // Allowed file formats
  },
});

// Multer upload middleware
const upload = multer({ storage: storage });

module.exports = { cloudinary, upload }; // Export both Cloudinary and the upload middleware
