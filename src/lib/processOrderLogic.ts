import { supabase } from '@/lib/supabaseClient';
import { SessionData } from '@/lib/sessionStore';

/**
 * Invokes the 'process-order' Supabase Edge Function to securely process the order.
 */
export const processOrder = async (session: SessionData) => {
  console.log('[processOrder] Invoking Edge Function with session:', session);
  try {
    // Invoke the Edge Function, passing the session data in the body
    const { data, error } = await supabase.functions.invoke('process-order', {
      body: { session }, // Pass the session object nested under 'session' key
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
    // Optionally return data if needed by the calling component
    return data; 

  } catch (error) {
    console.error('❌ Error invoking process-order Edge Function:', error);
    // Re-throw the error so the calling component can handle it (e.g., show message to user)
    throw error; 
  }
}; 