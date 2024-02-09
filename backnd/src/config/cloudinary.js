const cloudinary = require("cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.Cloud_name,
  api_key: process.env.Api_key,
  api_secret: process.env.Api_secret,
});

//Implementando verificación de subida de imagen, caso contrario, devovlerá error
const UploadImage = async (dir_image) => {
 try {
    const result = await cloudinary.v2.uploader.upload(dir_image);
    return result.secure_url;
 } catch (error) {
    console.error("Error al subir imagen:", error);
    return {
      error: true,
      code: error.http_code || 500,
      message: error.message || "Internal Server Error",
    };
 }
};

module.exports = { UploadImage };