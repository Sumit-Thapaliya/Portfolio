import nodemailer from 'nodemailer';

let transporter;

/**
 * Lazily creates a single reusable SMTP transporter.
 */
function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE !== 'false',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Sends a portfolio contact-form submission to the configured receiver
 * inbox, with the visitor's email set as reply-to for easy replying.
 */
export async function sendContactEmail({ name, email, message }) {
  const receiver = process.env.CONTACT_RECEIVER_EMAIL;

  if (!receiver) {
    throw new Error('CONTACT_RECEIVER_EMAIL is not configured on the server');
  }

  const mailer = getTransporter();

  await mailer.sendMail({
    from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
    to: receiver,
    replyTo: email,
    subject: `New portfolio message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6;">
        <h2>New message from your portfolio</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
      </div>
    `,
  });
}
