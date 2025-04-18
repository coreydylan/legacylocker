/*
  Stripe Webhook Handler
  ----------------------
  Listens for `payment_intent.succeeded` events. When a payment succeeds we:
    1. Read the `sessionId` we stored in the PaymentIntent metadata when the payment
       intent was created (see `api/create-payment-intent.js`).
    2. Mark the matching row in the `sessions` table as `Submitted`.
    3. Fetch purchaser email (prefers dedicated `email` column, falls back to
       JSON stored in `session_data`).
    4. Send an order‑confirmation email to the purchaser AND a notification email
       to Corey.

  Environment variables expected (all are already used elsewhere except the
  webhook + Resend vars which you will need to add to your deployment):
    STRIPE_SECRET_KEY           – Your Stripe secret key (already present)
    STRIPE_WEBHOOK_SECRET       – The signing secret for this webhook endpoint
    SUPABASE_URL                – Supabase project URL (already present)
    SUPABASE_SERVICE_ROLE_KEY   – Supabase service‑role key (already present)
    RESEND_API_KEY              – Resend API key for transactional email
*/

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import getRawBody from 'raw-body';

// --- Initialise SDKs ------------------------------------------------------ //
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const resend = new Resend(process.env.RESEND_API_KEY || '');

// -------------------------------------------------------------------------- //
export const config = {
  api: {
    bodyParser: false, // We need the raw body for Stripe signature verification
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', 'POST').status(405).end('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'];
  if (!sig) return res.status(400).send('Missing Stripe signature header');

  let event;
  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('[stripe-webhook] Signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle only the events we care about
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;

    const sessionId = paymentIntent.metadata?.sessionId;
    if (!sessionId) {
      console.warn('[stripe-webhook] No sessionId in PaymentIntent metadata. Skipping.');
      return res.status(200).json({ received: true });
    }

    try {
      // 1. Update status in Supabase
      const { data: existingRow, error: fetchErr } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .maybeSingle();

      if (fetchErr) throw fetchErr;

      if (!existingRow) {
        console.error(`[stripe-webhook] No matching session row for id ${sessionId}`);
      } else {
        // Update status -> 'Submitted' (add column if necessary)
        const { error: updateErr } = await supabase
          .from('sessions')
          .update({ status: 'Submitted' })
          .eq('id', sessionId);
        if (updateErr) throw updateErr;
        console.log(`[stripe-webhook] Session ${sessionId} status set to Submitted.`);
      }

      // 2. Send emails ------------------------------------------------------ //
      const purchaserEmail = existingRow?.email || existingRow?.session_data?.purchaser?.email;
      if (!purchaserEmail) {
        console.warn(`[stripe-webhook] Could not determine purchaser email for session ${sessionId}`);
      } else {
        // Confirmation to purchaser
        await resend.emails.send({
          from: 'Legacy Locker <orders@legacylocker.co>',
          to: purchaserEmail,
          subject: 'Your Legacy Locker order is confirmed',
          html: `<p>Hi there!</p><p>We've received your order and our team is already working on it. We'll reach out with updates soon.</p><p>Thank you for choosing Legacy Locker ❤️</p>`,
        });
        console.log(`[stripe-webhook] Confirmation email sent to ${purchaserEmail}`);
      }

      // Copy to Corey
      await resend.emails.send({
        from: 'Legacy Locker <orders@legacylocker.co>',
        to: 'corey@legacylockerco.com',
        subject: 'New Order',
        html: `<p>New order received.</p><p><strong>Session ID:</strong> ${sessionId}</p>${purchaserEmail ? `<p><strong>Purchaser:</strong> ${purchaserEmail}</p>` : ''}`,
      });
      console.log('[stripe-webhook] Notification email sent to corey@legacylockerco.com');

      return res.status(200).json({ received: true });
    } catch (err) {
      console.error('[stripe-webhook] Failed during order processing:', err);
      return res.status(500).send('Webhook handler failed');
    }
  }

  // For all other event types just acknowledge
  res.status(200).json({ received: true });
} 