import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from '@/lib/supabaseClient';
import { ConciergePreview } from '@/components/ConciergePreview';
import { Loader2 } from 'lucide-react';
import { useRegionalStories } from "@/hooks/useRegionalStories";

// IDs of the specific story series we want to show for concierge editions
const FEATURED_CONCIERGE_IDS = [
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
  website_description: string | null;
}

export const ConciergeEditionsSection = () => {
  const [samples, setSamples] = useState<StorySample[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
          FEATURED_CONCIERGE_IDS.includes(sample.story_series_id)
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

  return (
    <section id="concierge-editions" className="bg-white py-24">
      <div className="container mx-auto px-6 md:px-6">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[1060px]">
            {/* Title Block */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-12"
            >
              <div className="text-[clamp(24px,2.4vw,32px)]">
                <span className="font-bold bg-orange-500/10 px-3 py-1 rounded-md text-orange-500">
                  concierge editions
                </span>
              </div>
            </motion.div>

            {/* Narrative Text Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="max-w-[1200px]"
            >
              <div className="space-y-6">
                <p className="text-[clamp(20px,2vw,26px)] leading-relaxed text-[#444]">
                  Some stories are too important to rush. They deserve time, care, and someone to help bring them to life.
                </p>

                <p className="text-[clamp(20px,2vw,26px)] leading-relaxed text-[#444]">
                  Concierge Editions are our most hands-on offering — a fully guided process where our team works with you to uncover and preserve a meaningful story. Whether it's a legacy gift for a parent, a tribute to someone you love, or the untold history of your family, we help shape it into something extraordinary.
                </p>

                <p className="text-[clamp(20px,2vw,26px)] leading-relaxed text-[#444]">
                  You'll work one-on-one with our researchers, writers, and illustrators to craft a 12-card story series — each card arriving throughout the year, beautifully written, illustrated, and timed to perfection.
                </p>

                <p className="text-[clamp(20px,2vw,26px)] leading-relaxed text-[#444]">
                  It's for the stories that should never be forgotten — and the people who deserve to receive them.
                </p>

                <div className="pt-6">
                  <button
                    onClick={() => (window as any).handleStoryEditionSelection('concierge')}
                    className="group text-left px-3 py-1 rounded-sm transition-colors text-legacy-slate text-[clamp(20px,2vw,26px)] leading-relaxed flex items-center bg-orange-500/10 hover:bg-orange-500/20"
                  >
                    <span>Connect with a Concierge</span>
                    <span className="ml-2 group-hover:translate-x-0.5 transition-transform">→</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}; 