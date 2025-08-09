
import { UploadApiResponse } from "cloudinary";
import cloudinary from "./cloud";


const uploadToCloudinary = (fileBuffer: Buffer, folder: string): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "profile_photos" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result as UploadApiResponse);
      }
    ).end(fileBuffer);
  });
};

export default uploadToCloudinary;
