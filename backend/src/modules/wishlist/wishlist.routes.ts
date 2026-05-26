import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import {
  getUserWishlistHandler, addToWishlistHandler, removeFromWishlistHandler,
  checkIfInWishlistHandler, clearWishlistHandler, updateWishlistHandler,
} from "./wishlist.controller";

const router = Router();

// Protected routes
router.get("/",              protect, getUserWishlistHandler);
router.get("/check/:bookId", protect, checkIfInWishlistHandler);

router.post("/add",      protect, addToWishlistHandler);
router.post("/remove",   protect, removeFromWishlistHandler);
router.delete("/clear",  protect, clearWishlistHandler);
router.put("/update",    protect, updateWishlistHandler);

export default router;
