-- Update story samples for custom editions

-- First, delete any existing samples for these series
DELETE FROM story_samples 
WHERE story_series_id IN (
  'eedf215e-81a5-47fe-bef9-82026cc098ba',
  '88d8eb4d-a3a6-4df6-a54c-6aba3d69ec2d',
  '51de9c32-3b5f-4685-bb95-62a36f90d1fd'
);

-- Insert new samples for each series
INSERT INTO story_samples (
  id,
  story_series_id,
  headline,
  subtitle,
  story_body,
  badge_text,
  frame_color,
  badge_color,
  card_count,
  edition_text,
  image_url,
  custom_note,
  badge_off_or_on,
  footer_off_or_on
) VALUES
-- Sample 1 for series 1
(
  gen_random_uuid(),
  'eedf215e-81a5-47fe-bef9-82026cc098ba',
  'Your Custom Story Title',
  'YOUR STORY SUBTITLE',
  'Your story content goes here. This is a placeholder for the actual story content that will be provided.',
  'CUSTOM',
  '#2C5530',
  '#ED9831',
  1,
  'CUSTOM EDITION',
  'https://example.com/images/custom-sample-1.jpg',
  'Your custom story note',
  true,
  true
),
-- Sample 2 for series 2
(
  gen_random_uuid(),
  '88d8eb4d-a3a6-4df6-a54c-6aba3d69ec2d',
  'Your Custom Story Title',
  'YOUR STORY SUBTITLE',
  'Your story content goes here. This is a placeholder for the actual story content that will be provided.',
  'CUSTOM',
  '#2C5530',
  '#ED9831',
  1,
  'CUSTOM EDITION',
  'https://example.com/images/custom-sample-2.jpg',
  'Your custom story note',
  true,
  true
),
-- Sample 3 for series 3
(
  gen_random_uuid(),
  '51de9c32-3b5f-4685-bb95-62a36f90d1fd',
  'Your Custom Story Title',
  'YOUR STORY SUBTITLE',
  'Your story content goes here. This is a placeholder for the actual story content that will be provided.',
  'CUSTOM',
  '#2C5530',
  '#ED9831',
  1,
  'CUSTOM EDITION',
  'https://example.com/images/custom-sample-3.jpg',
  'Your custom story note',
  true,
  true
); 