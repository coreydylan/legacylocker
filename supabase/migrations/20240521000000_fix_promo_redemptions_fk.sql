-- Fix data-type mismatch for promo_redemptions.order_id foreign key
-- This migration assumes the previous promo_redemptions table either failed to create
-- or contains no data (because migration aborted). Adjust DROP TABLE as needed.

-- Safely drop the existing table if it exists (will cascade to indexes)
DROP TABLE IF EXISTS promo_redemptions CASCADE;

-- Recreate promo_redemptions with order_id as UUID (matching orders.id)
CREATE TABLE promo_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id UUID NOT NULL REFERENCES promo_codes(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  email TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Re-add index for query performance
CREATE INDEX promo_redemptions_promo_code_id_idx ON promo_redemptions(promo_code_id); 