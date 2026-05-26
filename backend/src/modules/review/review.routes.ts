import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import {
  getAllReviewsHandler, getReviewByIdHandler, getBookReviewsHandler,
  createReviewHandler, updateReviewHandler, deleteReviewHandler,
  markHelpfulHandler,
} from "./review.controller";

const router = Router();

router.get("/",           getAllReviewsHandler);
router.get("/book/:bookId", getBookReviewsHandler);
router.get("/:id",        getReviewByIdHandler);

router.post("/",              protect, createReviewHandler);
router.put("/:id",            protect, updateReviewHandler);
router.delete("/:id",         protect, deleteReviewHandler);
router.patch("/:id/helpful",  markHelpfulHandler);

export default router;
