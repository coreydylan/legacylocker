import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { StoryPreview } from '@/components/StoryPreview';
import { Loader2 } from 'lucide-react';

// IDs of the specific story series we want to show
const FEATURED_SERIES_IDS = [
  '05515e4b-0932-4c8a-9adc-373ccbaac1df', // San Diego baseball
  'f5e2d04a-4926-4c79-ac53-035b22641a8c', // Jazz in New Orleans
  '5faa9c88-820e-41bc-9579-2e6b50c98744'  // History of San Francisco
];

interface StorySample {
  id: string;
  story_series_id: string;
  headline: string;
  subtitle: string | null;
  story_body: string;
  badge_text: string | null;
  frame_color: string | null;
  icon: string | null;
  badge_color: string | null;
  card_count: number | null;
  edition_text: string | null;
  image_url: string | null;
  custom_note: string | null;
  badge_off_or_on: boolean;
  footer_off_or_on: boolean;
}

const StoryPreviewDemo = () => {
  const [samples, setSamples] = useState<StorySample[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        // First verify our series IDs exist
        const { data: seriesData, error: seriesError } = await supabase
          .from('story_series')
          .select('id, theme, subject, context')
          .in('id', FEATURED_SERIES_IDS);
        
        console.log('Checking story_series data:', {
          seriesData,
          seriesError,
          foundIds: seriesData?.map(s => s.id)
        });

        // Now try to get all story_samples and filter client-side to debug
        const { data: allSamples, error: samplesError } = await supabase
          .from('story_samples')
          .select('*')
          .order('created_at', { ascending: true });

        console.log('All story_samples:', {
          count: allSamples?.length,
          sampleIds: allSamples?.map(s => s.id),
          seriesIds: allSamples?.map(s => s.story_series_id)
        });

        if (samplesError) {
          console.error('Error fetching samples:', samplesError);
          throw samplesError;
        }

        // Filter samples client-side to see if we have matching data
        const matchingSamples = allSamples?.filter(sample => 
          FEATURED_SERIES_IDS.includes(sample.story_series_id)
        ) || [];

        console.log('Matching samples:', {
          count: matchingSamples.length,
          samples: matchingSamples
        });

        if (matchingSamples.length > 0) {
          const mappedSamples: StorySample[] = matchingSamples.map(sample => ({
            id: sample.id,
            story_series_id: sample.story_series_id,
            headline: sample.headline,
            subtitle: sample.subtitle,
            story_body: sample.story_body,
            badge_text: sample.badge_text,
            frame_color: sample.frame_color || '#2C5530',
            icon: sample.icon,
            badge_color: sample.badge_color || '#ED9831',
            card_count: sample.card_count || 1,
            edition_text: sample.edition_text || 'Legacy Locker',
            image_url: sample.image_url,
            custom_note: sample.footer_note,
            badge_off_or_on: true,
            footer_off_or_on: true
          }));
          setSamples(mappedSamples);
        } else {
          setError('No samples found for these story series.');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Failed to load story samples. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSamples();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-gray-400">{error}</p>
          <pre className="mt-4 text-left text-xs text-gray-500 bg-gray-800 p-4 rounded">
            {JSON.stringify(FEATURED_SERIES_IDS, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  if (samples.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Samples Available</h2>
          <p className="text-gray-400">There are no story samples to display at this time.</p>
          <pre className="mt-4 text-left text-xs text-gray-500 bg-gray-800 p-4 rounded">
            {JSON.stringify(FEATURED_SERIES_IDS, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Story Preview Demo</h1>
        <StoryPreview samples={samples} />
      </div>
    </div>
  );
};

export default StoryPreviewDemo; 