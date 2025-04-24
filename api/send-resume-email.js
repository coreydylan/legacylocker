// File: api/send-resume-email.js
const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, sessionId, recipientFirstName, purchaserName, editionTitle } = req.body

  if (!email || !sessionId) {
    return res.status(400).json({ error: 'Missing email or sessionId' })
  }

  const resumeLink = `https://legacylockerco.com/?session_id=${sessionId}`

  try {
    const { error } = await resend.emails.send({
      from: 'Legacy Locker <corey@legacylockerco.com>',
      to: email,
      subject: 'Return to Your Legacy Locker Session',
      html: `
<!DOCTYPE html>
<html lang="en" style="margin:0; padding:0; background-color:#fff; font-family:'Georgia', serif;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Return to Your Legacy Locker Session</title>
  </head>
  <body style="margin:0; padding:2rem; color:#2c2c2c; background-color:#fff; font-family:'Georgia', serif; line-height:1.6; max-width:600px; margin:auto;">

    <!-- Header -->
    <h1 style="font-size:26px; font-weight:normal; margin-bottom:0.5rem;">
      ✍️ Continue crafting your gift
    </h1>
    <p style="font-size:16px; color:#777; margin-top:0;">Legacy Locker</p>

    <!-- Body -->
    <p>Hi <strong>${purchaserName || 'there'}</strong>,</p>

    <p>You recently began setting up a Legacy Locker gift ${recipientFirstName ? `for ${recipientFirstName}` : ''} — a one-year subscription to the <strong>${editionTitle || 'Legacy Locker'}</strong> series.</p>

    <p>This edition is a tribute to the stories that shape us — delivered one card at a time. You've already made a meaningful start.</p>

    <p>When you're ready, just click below to pick up where you left off:</p>

    <!-- Button -->
    <div style="margin: 2rem 0;">
      <a href="${resumeLink}" style="display:inline-block; background:#000; color:#fff; padding:0.75rem 1.5rem; border-radius:4px; text-decoration:none; font-weight:bold;">
        Resume My Gift Setup
      </a>
    </div>

    <!-- Footer Note -->
    <p style="font-size:14px; color:#999;">
      If you didn't start this setup, you can safely ignore this message. Your link will expire in 30 days.
    </p>

    <hr style="margin:2rem 0; border:none; border-top:1px solid #eee;" />

    <p style="font-size:12px; color:#999;">Legacy Locker · A story in your mailbox every month</p>

  </body>
</html>`,
    })

    if (error) {
      console.error('Resend error:', error)
      return res.status(500).json({ error })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Unexpected error:', err)
    return res.status(500).json({ error: 'Unexpected error' })
  }
}