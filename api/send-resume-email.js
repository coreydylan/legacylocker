// File: api/send-resume-email.js
const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, sessionId } = req.body

  if (!email || !sessionId) {
    return res.status(400).json({ error: 'Missing email or sessionId' })
  }

  const resumeLink = `https://legacylockerco.com/?session_id=${sessionId}`

  try {
    const { error } = await resend.emails.send({
      from: 'Legacy Locker <corey@legacylockerco.com>',
      to: email,
      subject: 'Finish creating your gift',
      html: `
        <p>Hey there 👋</p>
        <p>You started creating a Legacy Locker gift — we saved your spot!</p>
        <p><a href="${resumeLink}">Click here to resume your setup</a></p>
        <p>We're here when you're ready ✨</p>
      `,
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