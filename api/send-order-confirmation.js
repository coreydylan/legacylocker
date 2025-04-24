const { Resend } = require('resend')
// const { render } = require('@react-email/render') // REMOVED - Potential edge runtime issue
// const OrderConfirmationEmail = require('../emails/OrderConfirmationEmail') // REMOVED

const resend = new Resend(process.env.RESEND_API_KEY)

module.exports = async (req, res) => {
  console.log('[send-order-confirmation] Received request')
  if (req.method !== 'POST') {
    console.log('[send-order-confirmation] Invalid method:', req.method)
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = req.body || {}
  console.log('[send-order-confirmation] Request body:', JSON.stringify(body))

  const {
    purchaserEmail,
    purchaserName,
    recipientName,
    editionName,
    shippingAddress,
    firstShipDate,
    editionType,
    firstMonth,
  } = body

  if (!purchaserEmail || !purchaserName) {
    console.log('[send-order-confirmation] Missing required fields')
    return res.status(400).json({ error: 'Missing purchaser email or name' })
  }

  // Log if API key seems present (don't log the key itself)
  console.log(`[send-order-confirmation] RESEND_API_KEY present: ${!!process.env.RESEND_API_KEY}`)

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

    console.log(`[send-order-confirmation] Attempting to send email to: ${purchaserEmail}`);
    const { data, error } = await resend.emails.send({
      from: 'Legacy Locker <corey@legacylockerco.com>',
      to: purchaserEmail,
      subject: 'Your Legacy Locker order is confirmed! 🎉',
      html: emailHtml,
    })

    if (error) {
      console.error('[send-order-confirmation] Resend error:', JSON.stringify(error));
      return res.status(500).json({ error: 'Failed to send email', details: error })
    }

    console.log('[send-order-confirmation] Email sent successfully! Data:', JSON.stringify(data));
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('[send-order-confirmation] Unexpected error:', err);
    return res.status(500).json({ error: 'Unexpected server error', details: err?.message })
  }
} 