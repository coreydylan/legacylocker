-- Add badge_off_or_on column to story_samples table
ALTER TABLE story_samples
ADD COLUMN badge_off_or_on boolean DEFAULT false;

-- Add comment to describe the column
COMMENT ON COLUMN story_samples.badge_off_or_on IS 'Toggle to control whether the badge is displayed or hidden'; 