import { AppError } from "../middlewares/errorHandler";
import { cloudinary } from "../config/cloudinary";

export const uploadBufferToCloudinary = (
  buffer: Buffer,
  folder: string,
  resourceType: "image" | "raw" = "image"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        ...(resourceType === "image"
          ? { transformation: [{ quality: "auto" }] }
          : { resource_type: "raw" }),
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error.message, error.http_code);
          return reject(new AppError("ফাইল আপলোড ব্যর্থ হয়েছে: " + error.message, 500));
        }
        if (!result?.secure_url) {
          return reject(new AppError("Cloudinary result নেই", 500));
        }
        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
};
