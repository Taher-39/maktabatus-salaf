import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "maktabatus-salaf/misc";

    // ১. পিডিএফ ফাইলের জন্য কন্ডিশন (নতুন যুক্ত করা previewPdf)
    if (file.fieldname === "previewPdf") {
      return {
        folder: "maktabatus-salaf/previews",
        resource_type: "raw", // পিডিএফ এর জন্য অবশ্যই raw হতে হবে
        format: "pdf",
      };
    }

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

export const upload = multer({
  storage,
  limits: { 
    // পিডিএফ ফাইলের কথা চিন্তা করে সাইজ লিমিট ২৫ মেগাবাইট (25MB) রাখা হলো
    fileSize: 25 * 1024 * 1024 
  }, 
});