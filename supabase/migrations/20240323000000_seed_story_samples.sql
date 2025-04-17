-- Seed initial story samples for featured series

-- San Diego Baseball samples
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
(
  '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
  '05515e4b-0932-4c8a-9adc-373ccbaac1df',
  'Opening Day at Petco Park',
  'A BASEBALL MEMORY',
  'The sun was setting over the San Diego Bay as I walked into Petco Park for the first time. The smell of fresh-cut grass and hot dogs filled the air. As a lifelong Padres fan, this moment was everything I''d dreamed of. The crowd''s energy was electric as we watched our team take the field in their crisp home whites. That evening, under the perfect San Diego sky, baseball wasn''t just a game – it was pure magic.',
  'PADRES',
  '#2C5530',
  '#ED9831',
  1,
  'SAN DIEGO BASEBALL',
  'https://example.com/images/petco-park.jpg',
  'From the heart of San Diego',
  true,
  true
);

-- New Orleans Jazz samples
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
(
  '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
  'f5e2d04a-4926-4c79-ac53-035b22641a8c',
  'Night at Preservation Hall',
  'JAZZ IN THE QUARTER',
  'The wooden benches creaked as we squeezed into Preservation Hall, where the walls seemed to pulse with decades of music history. The trumpet player raised his horn, and the first notes of "St. James Infirmary" filled the room. In that moment, time stood still. The raw, authentic sound of New Orleans jazz washed over us, and I understood why they call this city the birthplace of jazz.',
  'JAZZ',
  '#2C5530',
  '#ED9831',
  1,
  'NEW ORLEANS JAZZ',
  'https://example.com/images/preservation-hall.jpg',
  'The soul of New Orleans',
  true,
  true
);

-- San Francisco History samples
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
(
  '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
  '5faa9c88-820e-41bc-9579-2e6b50c98744',
  'The Golden Gate Opens',
  'CITY BY THE BAY',
  'On that foggy morning in 1937, thousands gathered to witness history. The Golden Gate Bridge, a marvel of engineering and human determination, stood ready to connect San Francisco to Marin County. As the fog lifted and the sun painted the bridge''s towers in brilliant orange, the crowd surged forward for the first pedestrian crossing. It was more than just a bridge – it was a symbol of progress, of connecting communities, and of the city''s boundless spirit.',
  'SF',
  '#2C5530',
  '#ED9831',
  1,
  'SAN FRANCISCO HISTORY',
  'https://example.com/images/golden-gate.jpg',
  'Stories from the City by the Bay',
  true,
  true
); 