import { sendContactEmail } from '../services/mail.service.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  await sendContactEmail({ name, email, message });

  res.status(200).json({
    success: true,
    message: 'Message sent successfully.',
  });
});
