import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middlewares/auth.middleware";
import { createInvoice, deleteInvoice, getInvoices, updateInvoice, uploadLogo } from "../controllers/invoice.controller";

const router : Router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

router.post("/upload-logo", requireAuth, upload.single("file"), uploadLogo);

router.post("/", requireAuth, createInvoice);
router.patch("/:id", requireAuth, updateInvoice);
router.delete("/:id", requireAuth, deleteInvoice);
router.get("/", requireAuth, getInvoices);

export default router;
