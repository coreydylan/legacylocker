import Stripe from 'stripe'

// Use the server-side environment variable without VITE_ prefix
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

// Add Edge Runtime configuration
export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    // Parse the request body
    const body = await req.json()
    const { amount, sessionId } = body

    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'Missing sessionId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // TEMPORARY OVERRIDE: Always use 1 cent for testing
    const testAmount = 1

    const paymentIntent = await stripe.paymentIntents.create({
      amount: testAmount,
      currency: 'usd',
      metadata: {
        sessionId,
        isTestPayment: 'true'
      },
    })

    return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error', 
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}