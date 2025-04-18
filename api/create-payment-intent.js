import Stripe from 'stripe'

// Use the server-side environment variable without VITE_ prefix
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { amount, sessionId } = req.body

    if (!sessionId) {
      return res.status(400).json({ error: 'Missing sessionId' })
    }

    // TEMPORARY OVERRIDE: Always use 1 cent for testing
    const testAmount = 1;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: testAmount,
      currency: 'usd',
      metadata: {
        sessionId,
        isTestPayment: 'true'
      },
    })

    res.status(200).json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    res.status(500).json({ error: 'Internal Server Error', details: error.message })
  }
}