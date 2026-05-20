import { Router } from "express";
import { protect, adminOnly } from "../../middlewares/auth.middleware";
import { getAllPublishersHandler, createPublisherHandler, updatePublisherHandler, deletePublisherHandler } from "./publisher.controller";

const router = Router();

router.get("/",       getAllPublishersHandler);
router.post("/",      protect, adminOnly, createPublisherHandler);
router.put("/:id",    protect, adminOnly, updatePublisherHandler);
router.delete("/:id", protect, adminOnly, deletePublisherHandler);

export default router;
