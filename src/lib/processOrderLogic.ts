import { supabase } from '@/lib/supabaseClient';
import { SessionData } from '@/lib/sessionStore';

/**
 * Writes an order and its card production rows to Supabase.
 *
 * Phase‑1 scope:
 *  – No email sending or side‑effects beyond DB inserts
 *  – Console logs for success/error for quick verification
 */
export const processOrder = async (session: SessionData) => {
  try {
    const {
      sessionId: _sessionId,
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

    // Build order payload
    const reviewRequired = selectedEdition.type !== 'signature';
    const readyForProduction = selectedEdition.type === 'signature';
    const orderPayload = {
      session_id: _sessionId,
      purchaser_name: purchaser?.fullName || null,
      purchaser_email: purchaser?.email || null,
      purchaser_phone: purchaser?.phone || null,
      custom_welcome_message: recipientInfo?.welcomeMessage || null,
      include_welcome_card: recipientInfo?.includeWelcomeCard ?? false,
      selected_edition_id: selectedEdition.id,
      // Flags / metadata
      order_status: 'submitted',
      review_required: reviewRequired,
      ready_for_production: readyForProduction,
      // Shipping (flattened)
      shipping_address: shipping?.address1 || recipientInfo?.shippingAddress?.full || null,
      shipping_address2: shipping?.address2 || null,
      shipping_city: shipping?.city || recipientInfo?.shippingAddress?.city || null,
      shipping_state: shipping?.state || recipientInfo?.shippingAddress?.state || null,
      shipping_zip: shipping?.zipCode || recipientInfo?.shippingAddress?.postalCode || null,
      shipping_country: shipping?.country || recipientInfo?.shippingAddress?.country || null,
      // Order‑level notes (gift occasion etc.)
      gift_occasion: recipientInfo?.relationship || null, // Fallback placeholder until explicit field exists
      order_date: new Date().toISOString(),
    } as const;

    // Insert order
    const { data: orderInsert, error: orderError } = await supabase
      .from('orders')
      .insert(orderPayload)
      .select()
      .single();

    if (orderError || !orderInsert) {
      throw orderError || new Error('Unknown error inserting order');
    }

    const orderId = orderInsert.id as string | number;

    // -----------------------------------------
    // 2) Insert order_recipients rows
    // -----------------------------------------
    const recipientRows: any[] = [];
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
        const { error: recipientsError } = await supabase
          .from('order_recipients')
          .insert(recipientRows);
        if (recipientsError) throw recipientsError;
      }
    }

    // -----------------------------------------
    // 3) Insert monthly_card_settings rows
    // -----------------------------------------
    const monthlySettingsRows: any[] = [];

    const monthNameToNumber = (name: string): number =>
      new Date(`${name} 1, 2025`).getMonth() + 1;

    if (selectedEdition.type === 'signature' && Array.isArray(signatureData)) {
      for (const md of signatureData) {
        const monthNum = monthNameToNumber(md.month);
        const year = md.shipDate ? new Date(md.shipDate).getFullYear() : new Date().getFullYear();
        monthlySettingsRows.push({
          order_id: orderId,
          month: monthNum,
          year,
          enabled: md.enabled,
          ship_date: md.shipDate,
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

    if (selectedEdition.type !== 'signature' && Array.isArray(customData)) {
      for (const card of customData) {
        const monthNum = monthNameToNumber(card.month);
        monthlySettingsRows.push({
          order_id: orderId,
          month: monthNum,
          year: card.year,
          enabled: card.enabled,
          ship_date: card.shipDate,
          title: card.title || null,
          story: card.story || null,
          footer_message: card.footerMessage || null,
          occasion: card.occasions || [],
          recipients: card.recipients || [],
          artwork_option: card.artworkOption || null,
          photo_url: card.photoUrl || null,
          story_locked: card.storyLocked ?? false,
          artwork_locked: card.artworkLocked ?? false,
        });
      }
    }

    if (monthlySettingsRows.length) {
      const { error: monthlySettingsError } = await supabase
        .from('monthly_card_settings')
        .insert(monthlySettingsRows);
      if (monthlySettingsError) throw monthlySettingsError;
    }

    // -----------------------------------------
    // 4) Build & insert card_production rows (one per enabled month)
    // -----------------------------------------
    const cardData: any[] = [];

    for (const row of monthlySettingsRows.filter(r => r.enabled)) {
      cardData.push({
        order_id: orderId,
        month: row.month,
        ship_date: row.ship_date,
        story_seed: row.story || null,
        custom_footer_message: row.footer_message || null,
        occasion_type: Array.isArray(row.occasion) && row.occasion.length ? row.occasion[0] : null,
        artwork_method: row.artwork_option || null,
        uploaded_photo: row.photo_url || null,
        has_custom_footer: !!row.footer_message,
        ai_story_required: selectedEdition.type === 'signature',
        is_fully_custom: selectedEdition.type !== 'signature',
        custom_edition_type: selectedEdition.type,
        production_status: 'not_started',
      });
    }

    if (cardData.length) {
      const { error: cardError } = await supabase.from('card_production').insert(cardData);
      if (cardError) throw cardError;
    }

    console.log('✅ Order processed:', orderInsert);
  } catch (error) {
    console.error('❌ Error processing order:', error);
    throw error; // let caller handle
  }
}; 