import { Router } from 'express';
import { submitContact } from '../controllers/contactController.js';
import { contactFormLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// POST /api/contact - handles validated, rate-limited contact form submissions
router.post('/', contactFormLimiter, submitContact);

export default router;

