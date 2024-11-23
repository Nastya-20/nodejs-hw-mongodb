import { v2 as cloudinary } from "cloudinary";
import { unlink } from "node:fs/promises";
import { env } from "./env.js";

cloudinary.config({
  cloud_name: env("CLOUDINARY_CLOUD_NAME"),
  api_key: env("CLOUDINARY_API_KEY"),
  api_secret: env("CLOUDINARY_API_SECRET"),
});

export const saveFileToCloudinary = async (file, folder) => {
  if (!file?.path) {
    throw new Error("File path is required.");
  }
  if (!folder) {
    throw new Error("Folder name is required.");
  }

  try {
    const response = await cloudinary.uploader.upload(file.path, {
      folder: 'photos',
    });
    return response.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);
    throw new Error("Failed to upload file to Cloudinary.");
  } finally {
    try {
      await unlink(file.path);
    } catch (err) {
      console.error("Failed to delete local file:", err.message);
    }
  }
};

