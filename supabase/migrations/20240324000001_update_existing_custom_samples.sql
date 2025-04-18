-- Update existing story samples for custom editions

-- Update samples for series 1
UPDATE story_samples
SET 
  headline = 'Your Updated Story Title 1',
  subtitle = 'YOUR UPDATED SUBTITLE 1',
  story_body = 'Your updated story content goes here. This is a placeholder for the actual story content that will be provided.',
  badge_text = 'CUSTOM',
  frame_color = '#2C5530',
  badge_color = '#ED9831',
  card_count = 1,
  edition_text = 'CUSTOM EDITION',
  image_url = 'https://example.com/images/custom-sample-1.jpg',
  custom_note = 'Your updated custom story note',
  badge_off_or_on = true,
  footer_off_or_on = true
WHERE story_series_id = 'eedf215e-81a5-47fe-bef9-82026cc098ba';

-- Update samples for series 2
UPDATE story_samples
SET 
  headline = 'Your Updated Story Title 2',
  subtitle = 'YOUR UPDATED SUBTITLE 2',
  story_body = 'Your updated story content goes here. This is a placeholder for the actual story content that will be provided.',
  badge_text = 'CUSTOM',
  frame_color = '#2C5530',
  badge_color = '#ED9831',
  card_count = 1,
  edition_text = 'CUSTOM EDITION',
  image_url = 'https://example.com/images/custom-sample-2.jpg',
  custom_note = 'Your updated custom story note',
  badge_off_or_on = true,
  footer_off_or_on = true
WHERE story_series_id = '88d8eb4d-a3a6-4df6-a54c-6aba3d69ec2d';

-- Update samples for series 3
UPDATE story_samples
SET 
  headline = 'Your Updated Story Title 3',
  subtitle = 'YOUR UPDATED SUBTITLE 3',
  story_body = 'Your updated story content goes here. This is a placeholder for the actual story content that will be provided.',
  badge_text = 'CUSTOM',
  frame_color = '#2C5530',
  badge_color = '#ED9831',
  card_count = 1,
  edition_text = 'CUSTOM EDITION',
  image_url = 'https://example.com/images/custom-sample-3.jpg',
  custom_note = 'Your updated custom story note',
  badge_off_or_on = true,
  footer_off_or_on = true
WHERE story_series_id = '51de9c32-3b5f-4685-bb95-62a36f90d1fd'; 