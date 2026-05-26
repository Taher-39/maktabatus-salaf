import { Router } from "express";
import { protect, adminOnly } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/upload.middleware";
import {
  getAllBannersHandler, getBannerByIdHandler, getActiveBannersHandler,
  createBannerHandler, updateBannerHandler, deleteBannerHandler,
} from "./banner.controller";

const router = Router();

router.get("/",        getAllBannersHandler);
router.get("/active",  getActiveBannersHandler);
router.get("/:id",     getBannerByIdHandler);

router.post("/",  protect, adminOnly, upload.single("image"), createBannerHandler);
router.put("/:id", protect, adminOnly, upload.single("image"), updateBannerHandler);
router.delete("/:id", protect, adminOnly, deleteBannerHandler);

export default router;
