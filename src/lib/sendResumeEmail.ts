import { Resend } from 'resend'

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY)

export const sendResumeEmail = async (email: string, sessionId: string) => {
  const resumeLink = `https://legacylocker.co/?session_id=${sessionId}`

  const { data, error } = await resend.emails.send({
    from: 'Legacy Locker <corey@legacylockerco.com>',
    to: email,
    subject: 'Finish creating your gift',
    html: `
      <p>Hey there 👋</p>
      <p>You're almost done setting up your Legacy Locker gift.</p>
      <p><a href="${resumeLink}">Click here to resume where you left off.</a></p>
      <p>We’ll save your place and keep the magic going ✨</p>
    `,
  })

  if (error) {
    console.error('❌ Email send failed:', error)
  } else {
    console.log('✅ Email sent:', data)
  }
}