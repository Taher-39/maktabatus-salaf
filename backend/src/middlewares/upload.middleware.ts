import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "maktabatus-salaf/misc";
    if (file.fieldname === "coverImage")   folder = "maktabatus-salaf/covers";
    if (file.fieldname === "previewPages") folder = "maktabatus-salaf/previews";
    if (file.fieldname === "paymentProof") folder = "maktabatus-salaf/payments";
    if (file.fieldname === "bannerImage")  folder = "maktabatus-salaf/banners";

    return {
      folder,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ quality: "auto" }],
    };
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
