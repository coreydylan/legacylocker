const { Resend } = require('resend')
const { render } = require('@react-email/render')
const OrderConfirmationEmail = require('../emails/OrderConfirmationEmail')

const resend = new Resend(process.env.RESEND_API_KEY)

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = req.body || {}

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
    return res.status(400).json({ error: 'Missing purchaser email or name' })
  }

  try {
    const emailProps = {
      purchaserName,
      recipientName,
      editionName,
      shippingAddress,
      firstShipDate,
      editionType,
      firstMonth,
    };

    // Render HTML version
    const emailHtml = render(OrderConfirmationEmail(emailProps));

    // Render plain-text version for improved deliverability / accessibility
    const emailText = render(OrderConfirmationEmail(emailProps), {
      plainText: true,
    });

    console.log(`[send-order-confirmation] Rendered plain-text length: ${emailText.length}`);

    console.log(`[send-order-confirmation] Rendered HTML length: ${emailHtml.length}`);
    // console.log(`[send-order-confirmation] Rendered HTML (sample): ${emailHtml.substring(0, 500)}...`);

    console.log(`[send-order-confirmation] Attempting to send email to: ${purchaserEmail}`);
    
    const { data, error } = await resend.emails.send({
      from: 'Legacy Locker <corey@legacylockerco.com>',
      to: purchaserEmail,
      subject: 'Your Legacy Locker order is confirmed! 🎉',
      html: emailHtml,
      text: emailText,
    })

    if (error) {
      console.error('[send-order-confirmation] Resend error:', JSON.stringify(error));
      return res.status(500).json({ error: 'Failed to send email', details: error })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('[send-order-confirmation] Unexpected error:', err);
    return res.status(500).json({ error: 'Unexpected server error', details: err?.message })
  }
} 