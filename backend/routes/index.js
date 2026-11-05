import { Router } from 'express';
import contactRoutes from './contactRoutes.js';
import healthRoutes from './healthRoutes.js';

const router = Router();

router.use('/contact', contactRoutes);
router.use('/health', healthRoutes);

export default router;

