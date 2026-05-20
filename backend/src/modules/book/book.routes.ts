import { Router } from "express";
import { protect, adminOnly } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/upload.middleware";
import {
  getAllBooksHandler, getBookBySlugHandler, getPopularBooksHandler,
  getNewBooksHandler, getBooksByPublisherHandler, createBookHandler,
  updateBookHandler, deleteBookHandler,
} from "./book.controller";

const router = Router();

router.get("/",              getAllBooksHandler);
router.get("/popular",       getPopularBooksHandler);
router.get("/new",           getNewBooksHandler);
router.get("/publisher/:id", getBooksByPublisherHandler);
router.get("/:slug",         getBookBySlugHandler);

router.post("/",    protect, adminOnly, upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "previewPages", maxCount: 7 },
]), createBookHandler);

router.put("/:id",  protect, adminOnly, upload.fields([
  { name: "coverImage", maxCount: 1 },
]), updateBookHandler);

router.delete("/:id", protect, adminOnly, deleteBookHandler);

export default router;
