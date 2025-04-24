import { supabase } from '@/lib/supabaseClient';
import { SessionData } from '@/lib/sessionStore';

// New: allow optional promo code parameter
export interface ProcessOrderOptions {
  promoCode?: string;
}

/**
 * Invokes the 'process-order' Supabase Edge Function to securely process the order.
 */
export const processOrder = async (
  session: SessionData,
  options: ProcessOrderOptions = {}
) => {
  console.log('[processOrder] Invoking Edge Function with session:', session);
  try {
    const { promoCode } = options;

    // Invoke the Edge Function, passing the session data in the body
    const { data, error } = await supabase.functions.invoke('process-order', {
      body: { session, promoCode }, // Include promo code if provided
    });

    if (error) {
      console.error('[processOrder] Edge Function invocation error:', error);
      throw new Error(`Edge Function invocation failed: ${error.message}`);
    }

    // Check for errors returned *from* the Edge Function's response body
    if (data?.error) {
      console.error('[processOrder] Edge Function returned an error:', data.error, data.details);
      throw new Error(`Order processing failed: ${data.details || data.error}`);
    }

    // Check for explicit success flag from the Edge Function
    if (!data?.success) {
      console.error('[processOrder] Edge Function did not indicate success:', data);
      throw new Error('Order processing did not complete successfully.');
    }

    console.log('✅ Order processed successfully via Edge Function. Response:', data);

    // After successful order processing, trigger confirmation email via internal API route
    try {
      const emailRes = await fetch('/api/send-order-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purchaserEmail: session?.purchaser?.email,
          purchaserName: session?.purchaser?.fullName,
          recipientName: session?.recipient?.firstName || session?.recipient?.recipient1FirstName || '',
          editionName: session?.selectedEdition?.display || session?.selectedEdition?.name || '',
          shippingAddress: session?.shipping?.address1 || session?.recipient?.shippingAddress?.full || '',
          firstShipDate: (session?.signatureData && session.signatureData[0]?.shipDate) || (session?.customData && session.customData[0]?.shipDate) || '',
          editionType: session?.selectedEdition?.type || 'signature',
          firstMonth: (session?.signatureData && session.signatureData[0]?.month) || (session?.customData && session.customData[0]?.month) || '',
        }),
      });
      if (!emailRes.ok) {
        console.error('[processOrder] Failed to send order confirmation email:', await emailRes.text());
      }
    } catch (emailErr) {
      console.error('[processOrder] Error sending order confirmation email:', emailErr);
    }

    // Optionally return data if needed by the calling component
    return data; 

  } catch (error) {
    console.error('❌ Error invoking process-order Edge Function:', error);
    // Re-throw the error so the calling component can handle it (e.g., show message to user)
    throw error; 
  }
}; 