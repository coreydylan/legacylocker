const { Resend } = require('resend')

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
    // Build HTML using inline template (mirrors working magic-link email)
    const emailHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Order Confirmation</title><style>@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Source+Sans+Pro:wght@300;400;600&display=swap');body,html{margin:0;padding:0;font-family:'Source Sans Pro',sans-serif;color:#333;line-height:1.6;background:#f9f7f4}.container{max-width:600px;margin:0 auto;padding:20px;background:#fff;border-radius:8px;box-shadow:0 4px 8px rgba(0,0,0,.05)}.header{text-align:center;padding:20px 0;border-bottom:1px solid #e0ddd7;margin-bottom:30px}.logo{max-width:180px;height:auto;margin:0 auto}.content{padding:0 30px}h2{font-family:'Playfair Display',serif;color:#2C5530;font-size:22px;margin-top:0}.highlight{font-weight:600;color:#2C5530}.footer{margin-top:40px;border-top:1px solid #e0ddd7;text-align:center;font-size:14px;color:#8a8070;padding-top:20px}@media(max-width:480px){.container{padding:15px}.content{padding:0 15px}h2{font-size:20px}}</style></head><body><div class="container"><div class="header"><svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1000" width="180" height="94"><path fill="#000" d="M330.86,438.53v-136.47h-48.62v205.1l4.77,3.81,62.91-27.64v-6.67c-11.92-5.24-19.06-10.01-19.06-38.13Z"/><path fill="#000" d="M282.25,162.29v151.08h48.62V93.66l-4.77-3.81-62.91,27.64v6.67c11.92,5.24,19.06,10.01,19.06,38.13Z"/></svg></div><div class="content"><h2>You're all set!</h2><p>Thanks for your order, <span class="highlight">${purchaserName}</span>.</p><p>You've just gifted <span class="highlight">${recipientName}</span> a year of stories through our <span class="highlight">${editionName}</span> edition. Whether it's about cherished memories, cultural heritage, or something totally custom — we'll take it from here.</p><p class="highlight" style="margin-bottom:10px;">Order Summary</p><p style="margin:0;">Edition: ${editionName}<br/>Recipient: ${recipientName}<br/>Ship-to: ${shippingAddress}<br/>Cards will begin shipping: ${firstShipDate}</p><p style="margin-top:20px;">We'll begin preparing your recipient's cards for printing, starting with ${firstMonth}. You'll receive an update when the first one ships.</p><p>If you have any questions in the meantime, just reply to this email or reach us at <a href="mailto:HELLO@legacylocker.com" style="color:#2C5530;">HELLO@legacylocker.com</a>.</p></div><div class="footer"><p>Legacy Locker • A year of stories, one card at a time.</p></div></div></body></html>`;

    const emailText = `You're all set!

Thanks for your order, ${purchaserName}.

You've just gifted ${recipientName} a year of stories through our ${editionName} edition. Whether it's about cherished memories, cultural heritage, or something totally custom — we'll take it from here.

Order Summary

Edition: ${editionName}
Recipient: ${recipientName}
Ship-to: ${shippingAddress}
Cards will begin shipping: ${firstShipDate}

We'll begin preparing your recipient's cards for printing, starting with ${firstMonth}. You'll receive an update when the first one ships.

If you have any questions in the meantime, just reply to this email or reach us at HELLO@legacylocker.com.

Legacy Locker • A year of stories, one card at a time.`;

    console.log(`[send-order-confirmation] Built HTML size: ${emailHtml.length}`);

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