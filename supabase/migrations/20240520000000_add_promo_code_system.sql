CREATE TYPE promo_code_type AS ENUM ('percentage', 'fixed_amount');

-- Create applies_to ENUM type
CREATE TYPE promo_applies_to AS ENUM ('all', 'signature', 'custom', 'concierge');

-- Main promo_codes table
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  type promo_code_type NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT,
  usage_limit INTEGER,
  usage_count INTEGER NOT NULL DEFAULT 0,
  starts_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITHOUT TIME ZONE,
  min_order_value NUMERIC,
  applies_to promo_applies_to NOT NULL DEFAULT 'all',
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Ensure promo code text is unique, case-insensitive
CREATE UNIQUE INDEX promo_codes_code_unique ON promo_codes (lower(code));

-- Optional table to track individual redemptions
CREATE TABLE promo_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id UUID NOT NULL REFERENCES promo_codes(id) ON DELETE CASCADE,
  order_id BIGINT REFERENCES orders(id) ON DELETE SET NULL,
  email TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Add promo_code_id column to orders table to record which code was used
ALTER TABLE orders
  ADD COLUMN promo_code_id UUID REFERENCES promo_codes(id);

-- Helpful index for quickly finding redemptions per code
CREATE INDEX promo_redemptions_promo_code_id_idx ON promo_redemptions(promo_code_id);

-- OPTIONAL: basic trigger to keep updated_at current
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_promo_codes_updated_at
BEFORE UPDATE ON promo_codes
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at(); 