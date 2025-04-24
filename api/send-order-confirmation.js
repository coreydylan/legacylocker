const { Resend } = require('resend')
const { render } = require('@react-email/render')
const OrderConfirmationEmail = require('../emails/OrderConfirmationEmail')

const resend = new Resend(process.env.RESEND_API_KEY)

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
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
  } = req.body || {}

  if (!purchaserEmail || !purchaserName) {
    return res.status(400).json({ error: 'Missing purchaser email or name' })
  }

  try {
    // Render HTML email using React Email component
    /* const emailHtml = render(
      OrderConfirmationEmail({
        purchaserName,
        recipientName,
        editionName,
        shippingAddress,
        firstShipDate,
        editionType,
        firstMonth,
      })
    ) */
    
    // --- TESTING: Use simple HTML string like the working magic link email ---
    const emailHtml = `<!DOCTYPE html><html><head><title>Order Test</title></head><body><h1>Test Order Confirmation</h1><p>For: ${purchaserName}</p><p>Email: ${purchaserEmail}</p></body></html>`;
    // --- END TESTING ---

    console.log('Attempting to send email to:', purchaserEmail);
    const { data, error } = await resend.emails.send({
      from: 'Legacy Locker <corey@legacylockerco.com>',
      to: purchaserEmail,
      subject: 'Your Legacy Locker order is confirmed! 🎉',
      html: emailHtml,
    })

    if (error) {
      console.error('Resend error:', error)
      return res.status(500).json({ error: 'Failed to send email', details: error })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Unexpected error sending order confirmation email:', err)
    return res.status(500).json({ error: 'Unexpected server error', details: err?.message })
  }
} 