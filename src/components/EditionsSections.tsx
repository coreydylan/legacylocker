import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from '@/lib/supabaseClient';
import { StoryPreview } from '@/components/StoryPreview';
import { Loader2 } from 'lucide-react';
import { useRegionalStories } from "@/hooks/useRegionalStories";

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

export const EditionsSections = () => {
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
          .select('*, story_series!inner(emoji, natural_language_name)')
          .order('created_at', { ascending: true });

        if (samplesError) throw samplesError;

        // Filter samples client-side to match our featured series
        const matchingSamples = allSamples?.filter(sample => 
          FEATURED_SERIES_IDS.includes(sample.story_series_id)
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
            footer_off_or_on: true
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
    <>
      {/* Signature Editions Section */}
      <section id="signature-editions" className="bg-white py-24">
        <div className="container mx-auto px-6 md:px-6">
          <div className="space-y-8">
            {/* Title Block */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-[clamp(20px,2vw,26px)] leading-relaxed"
            >
              <div className="text-[clamp(24px,2.4vw,32px)]">
                <span className="font-bold bg-legacy-green/10 px-3 py-1 rounded-md">
                  signature editions
                </span>
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="space-y-12"
            >
              <div className="space-y-6">
                <p className="text-[clamp(20px,2vw,26px)] leading-relaxed text-[#444]">
                  Our lives are shaped by the places we love, the teams we root for, the music that moves us, and the moments that made history. Signature Editions bring those stories to life — with beautifully illustrated cards that trace the cultural threads that connect us.
                </p>

                <p className="text-[clamp(20px,2vw,26px)] leading-relaxed text-[#444]">
                  Whether it's San Diego baseball, New Orleans jazz, or San Francisco's roots, each edition is locally contextualized and thoughtfully crafted. You'll receive 12 stories throughout the year, each one tied to a real moment in history from the month it arrives — creating a rhythm of discovery that unfolds over time.
                </p>

                <p className="text-[clamp(20px,2vw,26px)] leading-relaxed text-[#444]">
                  We cover themes across sports, history, music, art, and more — so it's easy to find one that fits anyone.
                </p>

                <p className="text-[clamp(20px,2vw,26px)] leading-relaxed text-[#444]">
                  And the best part? They're ready to go. You can personalize each card with custom milestone footers — birthdays, anniversaries, or just because — and be done in under 5 minutes. You pick the story. We handle the magic.
                </p>
              </div>
            </motion.div>

            {/* Preview Block */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex justify-center -mx-6 md:mx-0"
            >
              {isLoading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                  <Loader2 className="h-8 w-8 animate-spin text-legacy-slate" />
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
              ) : samples.length > 0 ? (
                <div className="w-full">
                  <StoryPreview
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
      </section>

      {/* Custom Editions Section */}
      <section id="custom-editions" className="bg-legacy-cream py-24">
        <div className="container mx-auto px-6 md:px-6">
          <div className="space-y-8">
            {/* Title Block */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-[clamp(20px,2vw,26px)] leading-relaxed"
            >
              <div className="text-[clamp(24px,2.4vw,32px)]">
                <span className="font-bold bg-legacy-gold/10 px-3 py-1 rounded-md text-legacy-gold">
                  custom editions
                </span>
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="space-y-12"
            >
              <div className="space-y-6">
                <p className="text-[clamp(20px,2vw,26px)] leading-relaxed text-[#444]">
                  Some stories aren't in the history books — they're in your camera roll, your group chats, or the kind of memories that resurface on long drives. Custom Editions turn those stories into something you can hold.
                </p>

                <p className="text-[clamp(20px,2vw,26px)] leading-relaxed text-[#444]">
                  Whether it's the story of your relationship, your childhood, or your family history, we'll help you turn it into a yearlong series of illustrated cards — one story for each month, delivered right when it matters.
                </p>

                <p className="text-[clamp(20px,2vw,26px)] leading-relaxed text-[#444]">
                  You can upload photos, add milestone messages, or just jot down a few notes — and we'll take care of the rest. The result is 12 beautiful cards that feel like you wrote a book… without actually having to write a book.
                </p>

                <p className="text-[clamp(20px,2vw,26px)] leading-relaxed text-[#444]">
                  It's the kind of gift that says more than a text or a phone call ever could — and it only takes a few minutes to set up.
                </p>

                <div className="pt-6">
                  <button
                    onClick={() => (window as any).handleStoryEditionSelection('custom')}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-legacy-gold/20 hover:bg-legacy-gold/30 text-legacy-gold font-medium rounded-sm transition-colors group text-[clamp(20px,2vw,26px)]"
                  >
                    Start a Custom Edition
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Concierge Section */}
      <section id="concierge-editions" className="bg-white py-24">
        <div className="container mx-auto px-6 md:px-6">
          <div className="space-y-8">
            {/* Title Block */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-[clamp(20px,2vw,26px)] leading-relaxed"
            >
              <div className="text-[clamp(24px,2.4vw,32px)]">
                <span className="font-bold bg-orange-500/10 px-3 py-1 rounded-md text-orange-500">
                  concierge
                </span>
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="space-y-12"
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
                    className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500/10 hover:bg-orange-500/15 text-orange-500 font-medium rounded-sm transition-colors group text-[clamp(20px,2vw,26px)]"
                  >
                    Connect with a Concierge
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}; 