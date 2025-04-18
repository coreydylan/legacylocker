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
    const orderPayload = {
      session_id: _sessionId,
      purchaser_name: purchaser?.fullName || null,
      purchaser_email: purchaser?.email || null,
      purchaser_phone: purchaser?.phone || null,
      custom_welcome_message: recipientInfo?.welcomeMessage || null,
      include_welcome_card: recipientInfo?.includeWelcomeCard ?? false,
      selected_edition_id: selectedEdition.id,
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
      order_date: new Date().toISOString(),
      order_status: 'submitted',
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

    // Build card rows
    const cardData: any[] = [];

    if (selectedEdition.type === 'signature' && Array.isArray(signatureData)) {
      for (const monthData of signatureData) {
        if (!monthData.enabled) continue;
        cardData.push({
          order_id: orderId,
          month: new Date(`2025-${monthData.month}-01`).getMonth() + 1,
          ship_date: monthData.shipDate,
          custom_footer_message: monthData.footerMessage,
          occasion_type: monthData.occasions?.[0] || null,
          has_custom_footer: !!monthData.footerMessage,
          production_status: 'not_started',
        });
      }
    }

    if (selectedEdition.type === 'custom' && Array.isArray(customData)) {
      for (const card of customData) {
        if (!card.enabled) continue;
        cardData.push({
          order_id: orderId,
          month: new Date(`${card.year}-${card.month}-01`).getMonth() + 1,
          ship_date: card.shipDate,
          story_input_raw: card.story,
          story_title_override: card.title,
          artwork_method: card.artworkOption,
          uploaded_photo: card.photoUrl,
          custom_footer_message: card.footerMessage,
          has_custom_footer: !!card.footerMessage,
          is_fully_custom: true,
          production_status: 'not_started',
        });
      }
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