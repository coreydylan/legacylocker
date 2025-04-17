-- Add subtitle and badge_text columns to story_samples table
ALTER TABLE story_samples
ADD COLUMN subtitle text,
ADD COLUMN badge_text text,
ADD COLUMN frame_color text,
ADD COLUMN icon text,
ADD COLUMN badge_copy text,
ADD COLUMN badge_color text,
ADD COLUMN card_count integer,
ADD COLUMN edition_text text;

-- Add comments to describe the columns
COMMENT ON COLUMN story_samples.subtitle IS 'Optional subtitle text for the story sample';
COMMENT ON COLUMN story_samples.badge_text IS 'Optional badge text to display on the story sample';
COMMENT ON COLUMN story_samples.frame_color IS 'Color of the card frame';
COMMENT ON COLUMN story_samples.icon IS 'Icon identifier for the story sample';
COMMENT ON COLUMN story_samples.badge_copy IS 'Text to display in the badge';
COMMENT ON COLUMN story_samples.badge_color IS 'Color of the badge';
COMMENT ON COLUMN story_samples.card_count IS 'Number of cards in the series';
COMMENT ON COLUMN story_samples.edition_text IS 'Text describing the edition type'; 