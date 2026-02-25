import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadOnCloudinary = async (filepath) => {
  try {
    if (!filepath) return null;

    const uploadResult = await cloudinary.uploader.upload(filepath, {
      folder: "virtual-ai",
    });

    fs.unlinkSync(filepath); // remove file from local storage

    return uploadResult.secure_url;

  } catch (error) {
    fs.unlinkSync(filepath); // remove file even if upload fails
    throw new Error("Cloudinary upload failed");
  }
};

export default uploadOnCloudinary;