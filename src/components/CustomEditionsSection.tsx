import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from '@/lib/supabaseClient';
import { CustomPreview } from '@/components/CustomPreview';
import { Loader2, ChevronDown } from 'lucide-react';
import { useRegionalStories } from "@/hooks/useRegionalStories";

// IDs of the specific story series we want to show for custom editions
const FEATURED_CUSTOM_IDS = [
  'eedf215e-81a5-47fe-bef9-82026cc098ba', // Custom story 1
  '88d8eb4d-a3a6-4df6-a54c-6aba3d69ec2d', // Custom story 2
  '51de9c32-3b5f-4685-bb95-62a36f90d1fd'  // Custom story 3
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
  website_description: string | null;
}

export const CustomEditionsSection = () => {
  const [samples, setSamples] = useState<StorySample[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const { stories } = useRegionalStories();

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        // Get all story_samples and filter client-side
        const { data: allSamples, error: samplesError } = await supabase
          .from('story_samples')
          .select('*, story_series!inner(emoji, natural_language_name, website_description)')
          .order('created_at', { ascending: true });

        if (samplesError) throw samplesError;

        // Filter samples client-side to match our featured series
        const matchingSamples = allSamples?.filter(sample => 
          FEATURED_CUSTOM_IDS.includes(sample.story_series_id)
        ) || [];

        if (matchingSamples.length > 0) {
          const mappedSamples: StorySample[] = matchingSamples.map(sample => ({
            id: sample.id,
            story_series_id: sample.story_series_id,
            headline: (sample.story_series as any).natural_language_name,
            subtitle: sample.subtitle,
            story_body: sample.story_body,
            badge_text: sample.badge_text,
            frame_color: sample.frame_color || '#2C5530',
            icon: (sample.story_series as any).emoji || null,
            badge_color: sample.badge_color || '#ED9831',
            card_count: sample.card_count || 1,
            edition_text: sample.edition_text || 'Legacy Locker',
            image_url: sample.image_url,
            custom_note: sample.footer_note,
            badge_off_or_on: true,
            footer_off_or_on: true,
            website_description: (sample.story_series as any).website_description || null
          }));
          setSamples(mappedSamples);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load story samples.');
      } finally {
        setIsLoading(false);
      }
    };

    if (stories.length > 0) {
      fetchSamples();
    }
  }, [stories]);

  const toggleTextExpanded = () => {
    setIsTextExpanded(!isTextExpanded);
  };

  return (
    <section id="custom-editions" className="bg-white py-24">
      <div className="container mx-auto px-6 md:px-6">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[1060px]">
            {/* Title Block - Now positioned above card but aligned left */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-8 md:pl-0"
            >
              <button 
                onClick={toggleTextExpanded}
                className="text-[clamp(24px,2.4vw,32px)] flex items-center gap-2 group"
              >
                <span className="font-bold bg-legacy-gold/10 px-3 py-1 rounded-md text-legacy-gold">
                  custom editions
                </span>
                <ChevronDown 
                  className={`h-5 w-5 text-legacy-gold transition-transform duration-300 ${isTextExpanded ? 'rotate-180' : ''}`} 
                />
              </button>
            </motion.div>

            {/* Collapsible Text Content */}
            {isTextExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <div className="bg-legacy-gold/5 p-6 rounded-lg max-w-[1200px]">
                  <div className="space-y-4 text-[clamp(14px,1.4vw,18px)] leading-relaxed text-[#444]">
                    <p>
                      Some stories aren't in the history books — they're in your camera roll, your group chats, or the kind of memories that resurface on long drives. Custom Editions turn those stories into something you can hold.
                    </p>
                    <p>
                      Whether it's the story of your relationship, your childhood, or your family history, we'll help you turn it into a yearlong series of illustrated cards — one story for each month, delivered right when it matters.
                    </p>
                    <p>
                      You can upload photos, add milestone messages, or just jot down a few notes — and we'll take care of the rest. The result is 12 beautiful cards that feel like you wrote a book… without actually having to write a book.
                    </p>
                    <p>
                      It's the kind of gift that says more than a text or a phone call ever could — and it only takes a few minutes to set up.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Preview Block */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {isLoading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                  <Loader2 className="h-8 w-8 animate-spin text-legacy-slate" />
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
              ) : samples.length > 0 ? (
                <div className="w-full">
                  <CustomPreview
                    samples={samples}
                    className="[&_button]:bg-legacy-cream [&_button]:text-legacy-slate [&_button]:hover:bg-legacy-slate/10 [&_button]:px-6 [&_button]:py-4 [&_button]:rounded-lg [&_button]:font-medium [&_button.active]:bg-legacy-slate [&_button.active]:text-white"
                  />
                </div>
              ) : (
                <div className="text-center text-legacy-slate/60 p-8">
                  No preview samples available
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}; 