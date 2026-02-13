import { Router } from 'express';
import authRoutes from "../routes/auth.routes";
import invoiceRoutes from "../routes/invoice.route";

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/invoice', invoiceRoutes);

export default router;
