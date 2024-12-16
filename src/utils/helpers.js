import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const isValidFileType = (file) => {
  const allowedImageTypes = /jpeg|jpg|png|gif/;
  const allowedVideoTypes = /mp4|mkv|mov/;
  const mimeType = file.mimetype.toLowerCase();

  return allowedImageTypes.test(mimeType) || allowedVideoTypes.test(mimeType);
};

export const removeFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Failed to delete file:", err);
    } else {
      console.log(`File deleted successfully: ${filePath}`);
    }
  });
};

export const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}
export const generateUniqueFileName = (originalName) => {
  const fileExtension = path.extname(originalName); // Extract file extension
  const uniqueName = `${uuidv4()}${fileExtension}`; // Use UUID as the base file name
  return uniqueName;
};
