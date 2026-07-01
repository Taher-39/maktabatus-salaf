import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "maktabatus-salaf/misc";



    // ২. অন্যান্য ইমেজ বা ছবির ফাইলের জন্য ফোল্ডার সিলেকশন
    if (file.fieldname === "coverImage")   folder = "maktabatus-salaf/covers";
    if (file.fieldname === "paymentProof") folder = "maktabatus-salaf/payments";
    if (file.fieldname === "bannerImage")  folder = "maktabatus-salaf/banners";

    return {
      folder,
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ quality: "auto" }],
    };
  },
});

// export const upload = multer({
//   storage,
//   limits: { 
//     // পিডিএফ ফাইলের কথা চিন্তা করে সাইজ লিমিট ২৫ মেগাবাইট (25MB) রাখা হলো
//     fileSize: 25 * 1024 * 1024 
//   }, 
// });

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB

  fileFilter: (_req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("শুধুমাত্র JPG, PNG, WebP ছবি এবং PDF ফাইল গ্রহণযোগ্য"));
    }
  },
});

// Helper: multer errors are not AppError. Convert them so error middleware returns clean JSON.
export const multerErrorToAppError = (err: any) => {
  if (!err) return null;
  // Multer "LIMIT_FILE_SIZE" etc
  if (err.code) {
    return new Error(err.message || "Upload limit exceeded");
  }
  return err;
};
