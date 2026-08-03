import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../middleware/validate.js';
import { contactSchema } from '../validators/contact.validator.js';
import { submitContactForm } from '../controllers/contact.controller.js';

const router = Router();

// Basic abuse protection: 5 submissions per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many messages sent. Please try again later.',
  },
});

router.post('/', contactLimiter, validate(contactSchema), submitContactForm);

export default router;
