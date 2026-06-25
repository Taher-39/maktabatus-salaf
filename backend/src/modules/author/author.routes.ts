import { Router } from "express";
import { protect, adminOnly } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/upload.middleware";
import {
  getAllAuthorsHandler, getAuthorByIdHandler, getAuthorBySlugHandler,
  createAuthorHandler, updateAuthorHandler, deleteAuthorHandler,
} from "./author.controller";

const router = Router();

router.get("/",     getAllAuthorsHandler);
router.get("/:slug",  getAuthorBySlugHandler);
router.get("/:id",  getAuthorByIdHandler);
router.post("/",    protect, adminOnly, upload.single("image"), createAuthorHandler);
router.put("/:id",  protect, adminOnly, upload.single("image"), updateAuthorHandler);
router.delete("/:id", protect, adminOnly, deleteAuthorHandler);

export default router;
