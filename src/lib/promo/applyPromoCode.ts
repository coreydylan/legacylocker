import { supabase } from '../supabaseClient';

export type PromoCodeType = 'percentage' | 'fixed_amount';
export type AppliesToType = 'all' | 'signature' | 'custom' | 'concierge';

export interface OrderContext {
  orderTotal: number; // pre-discount subtotal in the same currency used by promo code
  editionType: AppliesToType;
  email?: string; // optional — may be used for single-use codes later
}

export interface PromoResultValid {
  valid: true;
  promoCode: string;
  discountType: PromoCodeType;
  discountAmount: number; // always expressed in the currency of the order
  newTotal: number; // orderTotal minus discount (floored at 0)
}

export interface PromoResultInvalid {
  valid: false;
  errorMessage: string;
}

export type PromoResult = PromoResultValid | PromoResultInvalid;

/**
 * Looks up and validates a promo code against the supplied order context.
 *
 * NOTE: This function only performs *validation* and calculates the discount.
 * It does **NOT** mutate `usage_count`. You should call a separate helper at
 * final checkout to record a redemption.
 */
export async function applyPromoCode(
  rawCode: string,
  context: OrderContext
): Promise<PromoResult> {
  if (!rawCode || !rawCode.trim()) {
    return { valid: false, errorMessage: 'Please enter a promo code.' };
  }

  const code = rawCode.trim().toLowerCase();

  // Attempt to fetch promo code record
  const { data, error } = await supabase
    .from('promo_codes')
    .select('*')
    .ilike('code', code) // case-insensitive lookup
    .maybeSingle();

  if (error) {
    console.error('applyPromoCode: Supabase error', error);
    return { valid: false, errorMessage: 'Unable to verify promo code. Please try again.' };
  }

  if (!data) {
    return { valid: false, errorMessage: 'Promo code not found.' };
  }

  // Basic structural validations
  if (!data.enabled) {
    return { valid: false, errorMessage: 'This promo code is no longer active.' };
  }

  const now = new Date();

  // Helper to parse timestamp strings (from Supabase) as UTC
  const parseAsUTC = (ts: string) => {
    // If the string already has a timezone offset, just use Date()
    if (/Z|[+-]\d{2}:?\d{2}$/.test(ts)) return new Date(ts);
    // Otherwise treat it as UTC by appending Z
    return new Date(ts + 'Z');
  };

  if (data.starts_at && parseAsUTC(data.starts_at) > now) {
    return { valid: false, errorMessage: 'This promo code is not yet valid.' };
  }
  if (data.expires_at && parseAsUTC(data.expires_at) < now) {
    return { valid: false, errorMessage: 'This promo code has expired.' };
  }

  if (
    typeof data.usage_limit === 'number' &&
    typeof data.usage_count === 'number' &&
    data.usage_count >= data.usage_limit
  ) {
    return { valid: false, errorMessage: 'This promo code has reached its redemption limit.' };
  }

  if (
    typeof data.min_order_value === 'number' &&
    context.orderTotal < Number(data.min_order_value)
  ) {
    return {
      valid: false,
      errorMessage: `Minimum order value of ${data.min_order_value} required to use this code.`,
    };
  }

  // Applies-to edition check
  if (data.applies_to !== 'all' && data.applies_to !== context.editionType) {
    return { valid: false, errorMessage: 'This promo code does not apply to your order.' };
  }

  // Calculate discount
  let discountAmount = 0;
  if (data.type === 'percentage') {
    discountAmount = (context.orderTotal * Number(data.amount)) / 100;
  } else if (data.type === 'fixed_amount') {
    discountAmount = Number(data.amount);
  }

  // Ensure discount does not exceed order total
  if (discountAmount > context.orderTotal) discountAmount = context.orderTotal;

  const newTotal = context.orderTotal - discountAmount;

  return {
    valid: true,
    promoCode: data.code,
    discountType: data.type,
    discountAmount,
    newTotal,
  };
} 