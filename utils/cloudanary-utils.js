const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'du6squ4z0',
  api_key: '463417433416289',
  api_secret: 'NyJgf4Kpgoey2yVfdbM_yQNDyPg',
});

// Storage for house photos
const housePhotosStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Airbnb/housePhotos', // Folder for house photos
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], // Allowed file formats
  },
});

// Storage for user photos
const userPhotoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Airbnb/userPhoto', // Folder for user photos
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], // Allowed file formats
  },
});


const deleteHomeByUrl = async (photoUrl) => {
  const publicId = photoUrl
    .split('/image/upload/')[1] // Get everything after "/image/upload/"
    .split('.')[0] // Remove the file extension
    .split('/')
    .slice(1) // Remove the leading slash
    .join('/');
  console.log(publicId);
  try {
    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(publicId);
    console.log('Previous photo successfully deleted from Cloudinary.');
  } catch (err) {
    console.error('Error deleting previous photo from Cloudinary:', err);
  }
};

// Multer upload middlewares
const uploadHousePhotos = multer({ storage: housePhotosStorage });
const uploadUserPhotos = multer({ storage: userPhotoStorage });

module.exports = { cloudinary, uploadHousePhotos, uploadUserPhotos, deleteHomeByUrl };
