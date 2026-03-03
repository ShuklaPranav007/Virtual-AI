import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (filePath) => {
  try {

    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });

    if (!process.env.CLOUD_API_KEY) {
      throw new Error("Cloudinary API key missing in .env");
    }

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(filePath);

    return uploadResult.secure_url;

  } catch (error) {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    console.error("Cloudinary Error:", error);
    throw new Error("Cloudinary upload failed");
  }
};

export default uploadOnCloudinary;