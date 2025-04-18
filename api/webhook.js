import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Add Edge Runtime configuration
export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const sig = req.headers.get('stripe-signature');
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    // Get the raw body as text
    const rawBody = await req.text();
    
    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      endpointSecret
    );

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        // Handle successful payment
        console.log('PaymentIntent was successful!');
        break;
      // Add other event types as needed
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return new Response(JSON.stringify({ message: `Webhook Error: ${err.message}` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 