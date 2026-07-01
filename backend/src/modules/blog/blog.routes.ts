import { Router } from "express";
import { protect, adminOnly } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/upload.middleware";
import {
  getAllBlogsHandler, getBlogBySlugHandler, getBlogByIdHandler,
  createBlogHandler, updateBlogHandler, deleteBlogHandler,
  likeBlogHandler, incrementViewsHandler,
} from "./blog.controller";

const router = Router();

router.get("/", getAllBlogsHandler);
router.get("/id/:id", getBlogByIdHandler);
router.get("/:slug", getBlogBySlugHandler);

router.post("/", protect, adminOnly, upload.single("image"), createBlogHandler);
router.put("/:id", protect, adminOnly, upload.single("image"), updateBlogHandler);
router.delete("/:id", protect, adminOnly, deleteBlogHandler);
router.patch("/:id/like", likeBlogHandler);
router.patch("/:id/views", incrementViewsHandler);

export default router;
