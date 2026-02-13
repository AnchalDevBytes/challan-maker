import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middlewares/auth.middleware";
import { createInvoice, getInvoices } from "../controllers/invoice.controller";

const router : Router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post("/", requireAuth, upload.single("file"), createInvoice);
router.get("/", requireAuth, getInvoices);

export default router;
