const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// For development only - remove this in production


  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
  });


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "wonderlast_DEV",
    allowedFormats: ["jpeg", "png", "jpg"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
    resource_type: "auto",
  },
});

module.exports = { cloudinary, storage };