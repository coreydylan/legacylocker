import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts' // Assuming you have a standard CORS header setup
import { createServiceRoleClient, createJsonResponse } from '../_shared/supabaseClientServiceRole.ts'
// Import SessionData type if needed - adjust path as necessary
// You might need to adjust the import path based on your project structure
// or duplicate/share the type definition.
// import type { SessionData } from '../../src/lib/sessionStore.ts'; 

// Define an interface for the expected request body
interface ProcessOrderPayload {
  session: any; // Use 'any' for now, or ideally import/define SessionData type
  promoCode?: string; // Newly added optional promo code string
}

console.log(`Function "process-order" up and running!`)

// Helper to convert artworkOption values from UI (with dashes) to DB enum format (with underscores)
const convertArtworkOption = (option: string | null | undefined): string | null => {
  if (!option) return null;
  // Convert from kebab-case to snake_case
  return option.replace(/-/g, '_');
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Ensure the request method is POST
    if (req.method !== 'POST') {
      return createJsonResponse({ error: 'Method Not Allowed' }, 405, corsHeaders);
    }

    // Parse the request body
    const { session, promoCode } = (await req.json()) as ProcessOrderPayload;

    if (!session) {
      return createJsonResponse({ error: 'Missing session data in request body' }, 400, corsHeaders);
    }
    
    // ----- CORE ORDER PROCESSING LOGIC -----
    // Initialize Supabase client with service_role
    const supabaseAdmin = createServiceRoleClient();

    // --- Start: Logic adapted from src/lib/processOrderLogic.ts ---
    const {
      // sessionId: _sessionId, // Session ID might not be needed directly if not stored in 'orders'
      purchaser,
      selectedEdition,
      signatureData,
      customData,
      recipient: recipientInfo,
      shipping,
    } = session;

    if (!selectedEdition) {
      throw new Error('No edition selected.');
    }

    // Placeholder for promo code id (if any) and record
    let promoCodeId: string | null = null;
    let fetchedPromo: any | null = null;
    // If a promo code was passed, look it up and set promoCodeId
    if (promoCode) {
      const { data: promoData, error: promoErr } = await supabaseAdmin
        .from('promo_codes')
        .select('*')
        .ilike('code', promoCode)
        .maybeSingle();

      if (promoErr) {
        console.error('[process-order] Failed to fetch promo code:', promoErr);
        throw promoErr;
      }
      if (promoData) {
        promoCodeId = promoData.id as string;
        fetchedPromo = promoData;
      }
    }

    // Build order payload (Aligned with DB Schema)
    const orderPayload = {
      purchaser_name: purchaser?.fullName || null,
      purchaser_email: purchaser?.email || null,
      purchaser_phone: purchaser?.phone || null,
      custom_welcome_message: recipientInfo?.welcomeMessage || null,
      include_welcome_card: recipientInfo?.includeWelcomeCard ?? false,
      story_series_id: selectedEdition.id, 
      who_is_it_for: session.recipientType || null, 
      custom_edition_type: selectedEdition.type || null, 
      recipient_1_name: recipientInfo?.firstName || recipientInfo?.recipient1FirstName || null,
      recipient_1_birthday: recipientInfo?.birthday || recipientInfo?.recipient1Birthday || null,
      recipient_2_name: recipientInfo?.recipient2FirstName || null,
      recipient_2_birthday: recipientInfo?.recipient2Birthday || null,
      recipient_anniversary: recipientInfo?.anniversary || null,
      shipping_address: shipping?.address1 || recipientInfo?.shippingAddress?.full || null,
      shipping_city: shipping?.city || recipientInfo?.shippingAddress?.city || null,
      shipping_state: shipping?.state || recipientInfo?.shippingAddress?.state || null,
      shipping_zip: shipping?.zipCode || recipientInfo?.shippingAddress?.postalCode || null,
      shipping_country: shipping?.country || recipientInfo?.shippingAddress?.country || null,
      gift_occasion: recipientInfo?.relationship || null, 
      order_date: new Date().toISOString(),
      promo_code_id: promoCodeId,
    };

    // Insert order
    const { data: orderInsert, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert(orderPayload)
      .select()
      .single();

    if (orderError || !orderInsert) {
      console.error("Error inserting order:", orderError);
      throw orderError || new Error('Unknown error inserting order');
    }

    const orderId = orderInsert.id as string | number;

    // Insert order_recipients rows
    const recipientRows: any[] = [];
    // ... (Copy the logic for building recipientRows from processOrderLogic.ts) ...
    if (recipientInfo) {
      if (recipientInfo.type === 'individual') {
        recipientRows.push({
          order_id: orderId,
          first_name: recipientInfo.firstName || null,
          last_name: recipientInfo.lastName || null,
          relationship: recipientInfo.relationship || null,
          birthday: recipientInfo.birthday || null,
          is_primary: true,
          recipient_type: 'individual',
        });
      }
      if (recipientInfo.type === 'couple') {
        // Primary recipient
        recipientRows.push({
          order_id: orderId,
          first_name: recipientInfo.recipient1FirstName || null,
          last_name: recipientInfo.recipient1LastName || null,
          relationship: recipientInfo.relationship || null,
          birthday: recipientInfo.recipient1Birthday || null,
          is_primary: true,
          recipient_type: 'couple',
        });
        // Secondary recipient
        recipientRows.push({
          order_id: orderId,
          first_name: recipientInfo.recipient2FirstName || null,
          last_name: recipientInfo.recipient2LastName || null,
          relationship: recipientInfo.relationship || null,
          birthday: recipientInfo.recipient2Birthday || null,
          is_primary: false,
          recipient_type: 'couple',
        });
      }
      if (recipientRows.length) {
        const { error: recipientsError } = await supabaseAdmin
          .from('order_recipients')
          .insert(recipientRows);
        if (recipientsError) {
          console.error("Error inserting recipients:", recipientsError);
          throw recipientsError;
        }
      }
    }


    // Insert monthly_card_settings rows
    const monthlySettingsRows: any[] = [];
    const monthNameToNumber = (name: string): number => new Date(`${name} 1, 2025`).getMonth() + 1;
    // ... (Copy the logic for building monthlySettingsRows from processOrderLogic.ts) ...
     if (selectedEdition.type === 'signature' && Array.isArray(signatureData)) {
      for (const md of signatureData) {
        const monthNum = monthNameToNumber(md.month);
        const year = md.shipDate ? new Date(md.shipDate).getFullYear() : new Date().getFullYear(); // Consider edge case year if shipDate is early next year
        monthlySettingsRows.push({
          order_id: orderId,
          month: monthNum,
          year,
          enabled: md.enabled,
          ship_date: md.shipDate || null,
          title: null,
          story: null,
          footer_message: md.footerMessage || null,
          occasion: md.occasions || [],
          recipients: md.recipients || [],
          artwork_option: null,
          photo_url: null,
          story_locked: false,
          artwork_locked: false,
        });
      }
    }
    const computeEnabled = (c: any): boolean => {
      const hasContent = Boolean(
        c.title || c.story || c.footerMessage || c.shipDate || c.artworkOption || c.photoUrl ||
        (Array.isArray(c.occasions) && c.occasions.length) || (Array.isArray(c.recipients) && c.recipients.length)
      );
      // If enabled explicitly true, respect it
      if (c.enabled === true) return true;
      // If enabled explicitly false but there is content, treat as true (needed for DB constraint)
      if (c.enabled === false && hasContent) return true;
      // Otherwise rely on presence of content
      return hasContent;
    };

    for (const card of customData) {
      const monthNum = monthNameToNumber(card.month);
      const enabledFlag = computeEnabled(card);
      monthlySettingsRows.push({
        order_id: orderId,
        month: monthNum,
        year: card.year,
        enabled: enabledFlag,
        ship_date: card.shipDate || null,
        title: card.title || null,
        story: card.story || null,
        footer_message: card.footerMessage || null,
        occasion: card.occasions || [],
        recipients: card.recipients || [],
        artwork_option: enabledFlag ? convertArtworkOption(card.artworkOption) : null,
        photo_url: enabledFlag ? (card.photoUrl || null) : null,
        story_locked: card.storyLocked ?? false,
        artwork_locked: card.artworkLocked ?? false,
      });
    }
    if (monthlySettingsRows.length) {
      const { error: monthlySettingsError } = await supabaseAdmin
        .from('monthly_card_settings')
        .insert(monthlySettingsRows);
      if (monthlySettingsError) {
        console.error("Error inserting monthly settings:", monthlySettingsError);
        throw monthlySettingsError;
      }
    }

    // Build & insert card_production rows
    const cardData: any[] = [];
    // ... (Copy the logic for building cardData from processOrderLogic.ts, using schema-aligned fields) ...
     for (const row of monthlySettingsRows.filter(r => r.enabled)) {
      cardData.push({
        order_id: orderId,
        month: row.month,
        ship_date: row.ship_date || null,
        story_input_raw: row.story || null,
        custom_footer_message: row.footer_message || null,
        occasion_type: Array.isArray(row.occasion) && row.occasion.length ? row.occasion[0] : null,
        artwork_method: row.artwork_option || null,
        uploaded_photo: row.photo_url || null,
        has_custom_footer: !!row.footer_message,
        is_fully_custom: selectedEdition.type !== 'signature',
        custom_edition_type: selectedEdition.type,
        production_status: 'not_started',
      });
    }
    if (cardData.length) {
      const { error: cardError } = await supabaseAdmin
        .from('card_production')
        .insert(cardData);
      if (cardError) {
        console.error("Error inserting card production:", cardError);
        throw cardError;
      }
    }
    // --- End: Adapted Logic ---

    console.log('✅ Order processed via Edge Function:', orderInsert);
    // Return success response
    return createJsonResponse({ success: true, orderId: orderId }, 200, corsHeaders);

  } catch (error) {
    console.error('❌ Error processing order in Edge Function:', error);
    // Return error response
    // Check if error is a PostgrestError for more specific details
     const message = error instanceof Error ? error.message : 'Unknown error';
     const status = (error as any)?.status || 500; // Use Postgrest status if available
    return createJsonResponse({ error: 'Failed to process order', details: message }, status, corsHeaders);
  }
}) 