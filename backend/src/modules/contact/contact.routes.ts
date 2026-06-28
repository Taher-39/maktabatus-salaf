import { Router } from "express";
import { sendContactHandler } from "./contact.controller";

const router = Router();

router.post("/send", sendContactHandler);

export default router;

