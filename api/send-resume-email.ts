// File: /api/send-resume-email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  const body = await req.json()
  const { email, sessionId } = body

  if (!email || !sessionId) {
    return new Response(JSON.stringify({ error: 'Missing email or sessionId' }), { status: 400 })
  }

  const resumeLink = `https://legacylocker.co/?session_id=${sessionId}`

  try {
    const { data, error } = await resend.emails.send({
      from: 'Legacy Locker <hello@yourdomain.com>',
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
      return new Response(JSON.stringify({ error }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(JSON.stringify({ error: 'Unexpected error' }), { status: 500 })
  }
}