import { Resend } from 'resend';
import { render } from '@react-email/render';
// Default export from the email template
import OrderConfirmationEmail from '../emails/OrderConfirmationEmail';

// Helper to create plain text (render creates automatically but we can extract) – optional

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    purchaserEmail,
    purchaserName,
    recipientName,
    editionName,
    shippingAddress,
    firstShipDate,
    editionType,
    firstMonth,
  } = req.body || {};

  if (!purchaserEmail || !purchaserName) {
    return res.status(400).json({ error: 'Missing purchaser email or name' });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Render HTML from React Email component
    const emailHtml = await render(
      OrderConfirmationEmail({
        purchaserName,
        recipientName,
        editionName,
        shippingAddress,
        firstShipDate,
        editionType,
        firstMonth,
      })
    );

    const { error } = await resend.emails.send({
      from: 'Legacy Locker <corey@legacylockerco.com>',
      to: purchaserEmail,
      subject: 'Your Legacy Locker order is confirmed! 🎉',
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email', details: error });
    }

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('Unexpected error sending order confirmation email:', err);
    return res.status(500).json({ error: 'Unexpected server error', details: err?.message });
  }
} 