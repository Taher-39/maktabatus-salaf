import { Router } from "express";
import { protect, adminOnly } from "../../middlewares/auth.middleware";
import { getAllCategoriesHandler, createCategoryHandler, updateCategoryHandler, deleteCategoryHandler } from "./category.controller";

const router = Router();

router.get("/",       getAllCategoriesHandler);
router.post("/",      protect, adminOnly, createCategoryHandler);
router.put("/:id",    protect, adminOnly, updateCategoryHandler);
router.delete("/:id", protect, adminOnly, deleteCategoryHandler);

export default router;
