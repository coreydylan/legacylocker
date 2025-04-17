import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

interface StorySeries {
  emoji: string;
  natural_language_name: string;
}

interface LocationData {
  latitude: number | null;
  longitude: number | null;
  error?: string;
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
        // Step 1: Get user's location via IP
        const locationResponse = await fetch("/api/geo");
        const locationData: LocationData = await locationResponse.json();
        
        // Check for valid coordinates
        if (!locationData.latitude || !locationData.longitude) {
          throw new Error(locationData.error || "Location data unavailable");
        }

        // Step 2: Match region
        const { data: regionMatch, error: regionError } = await supabase
          .from("region_boxes")
          .select("region_key")
          .lte("min_lat", locationData.latitude)
          .gte("max_lat", locationData.latitude)
          .lte("min_lon", locationData.longitude)
          .gte("max_lon", locationData.longitude)
          .maybeSingle();

        if (regionError) throw regionError;

        const regionKey = regionMatch?.region_key || 'national';

        // Step 3: Fetch regional stories
        let { data: regionStories, error: storiesError } = await supabase
          .from("story_series")
          .select("emoji, natural_language_name")
          .eq("region_key", regionKey)
          .not("theme", "in", ["Personal", "Corporate", "Ancestral"])
          .limit(3);

        if (storiesError) throw storiesError;

        // Fill with fallback stories if needed
        if (!regionStories || regionStories.length < 3) {
          const { data: fallbackStories, error: fallbackError } = await supabase
            .from("story_series")
            .select("emoji, natural_language_name")
            .eq("region_key", "national")
            .not("theme", "in", ["Personal", "Corporate", "Ancestral"])
            .limit(3 - (regionStories?.length || 0));

          if (fallbackError) throw fallbackError;

          regionStories = [...(regionStories || []), ...(fallbackStories || [])];
        }

        setStories(regionStories || []);
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