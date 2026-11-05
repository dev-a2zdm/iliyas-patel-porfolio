import { Router } from 'express';
import { getHealth } from '../controllers/healthController.js';

const router = Router();

// GET /api/health - returns system and database health status
router.get('/', getHealth);

export default router;

