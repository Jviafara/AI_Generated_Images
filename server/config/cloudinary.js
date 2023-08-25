const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Instance os cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary,
    alowwFormat: ['jpg', 'jpeg', 'png', 'webp'],
    params: {
        folder: 'AI Generate Images',
        transformation: [{ width: 500, height: 5000, crop: 'limit' }],
    },
});

module.exports = storage;
