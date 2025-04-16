// src/types/supabase.ts
export interface StorySeriesRow {
  id: string;
  theme: string | null; // Category
  subject: string | null; // Subcategory
  context: string | null; // Location
  series_type: 'Signature Edition' | 'Custom Edition' | 'Concierge Edition' | null;
  edition: string | null;
  display_title: string; // The main label to show
  custom_edition_prompt: string | null;
  hidden_team: string | null; // For searching
  use_cases: string[] | null; // Assuming this might be an array if used
}

// Simplified type for options passed to the command menu
export interface StoryOption {
  id: string;
  label: string; // display_title
  type: 'signature' | 'custom' | 'concierge';
  categoryDisplay: string; // theme
  subcategoryDisplay?: string; // subject
  locationDisplay?: string; // context
  searchKeywords?: string[]; // derived from hidden_team
} 