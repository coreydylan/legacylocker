import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

interface StorySeries {
  emoji: string;
  natural_language_name: string;
}

// Supabase client configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize Supabase client outside of the hook
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function useRegionalStories() {
  const [stories, setStories] = useState<StorySeries[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStories() {
      try {
        // TODO: Revisit geo-based story matching later
        // For now, fetch predefined fallback stories directly from Supabase
        const { data: fallbackStories, error } = await supabase
          .from("story_series")
          .select("emoji, natural_language_name")
          .in("id", [
            "05515e4b-0932-4c8a-9adc-373ccbaac1df", // San Diego baseball
            "f5e2d04a-4926-4c79-ac53-035b22641a8c", // Jazz in New Orleans
            "5faa9c88-820e-41bc-9579-2e6b50c98744"  // History of San Francisco
          ]);

        if (error) throw error;

        setStories(fallbackStories || []);
      } catch (err) {
        console.error('Error fetching regional stories:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch stories');
        // Set default stories on error
        setStories([
          { emoji: "🏟", natural_language_name: "San Diego baseball" },
          { emoji: "🎷", natural_language_name: "jazz in New Orleans" },
          { emoji: "✊", natural_language_name: "civil rights in San Francisco" }
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStories();
  }, []);

  return { stories, isLoading, error };
} 