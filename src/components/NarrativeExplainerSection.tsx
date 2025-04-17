import { motion } from "framer-motion";
import { useState } from "react";
import { useNextHoliday } from "@/hooks/useNextHoliday";
import { useRegionalStories } from "@/hooks/useRegionalStories";
import { FadeContent } from "@/components/FadeContent";
import { FadeSection } from "@/components/FadeSection";

interface NarrativeExplainerSectionProps {
  onThemeSelect?: (theme: string) => void;
}

export const NarrativeExplainerSection = ({ onThemeSelect }: NarrativeExplainerSectionProps) => {
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const { displayText, nextHoliday } = useNextHoliday();
  const { stories, isLoading } = useRegionalStories();

  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
    onThemeSelect?.(theme);
  };

  const formatStoriesList = () => {
    if (isLoading || stories.length === 0) {
      return (
        <div className="space-y-2 pl-4">
          <p>
            <button 
              className="dotted-underline text-legacy-green" 
              onClick={() => handleThemeSelect("San Diego Baseball")}
            >
              San Diego baseball
            </button>
          </p>
          <p>
            <button 
              className="dotted-underline text-legacy-green" 
              onClick={() => handleThemeSelect("Jazz in New Orleans")}
            >
              jazz in New Orleans
            </button>
          </p>
          <p>
            <button 
              className="dotted-underline text-legacy-green" 
              onClick={() => handleThemeSelect("Civil Rights in SF")}
            >
              civil rights in San Francisco
            </button>
          </p>
          <p>and so many more.</p>
        </div>
      );
    }

    return (
      <div className="space-y-2 pl-4">
        {stories.map((story, index) => (
          <p key={story.natural_language_name}>
            <span className="mr-1">{story.emoji}</span>
            <button 
              className="dotted-underline text-legacy-green" 
              onClick={() => handleThemeSelect(story.natural_language_name)}
            >
              {story.natural_language_name}
            </button>
          </p>
        ))}
        <p>and so many more.</p>
      </div>
    );
  };

  return (
    <section id="how-it-works" className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="space-y-24">
          {/* Intro Paragraph Block */}
          <div className="space-y-8">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[clamp(20px,2.2vw,28px)] leading-relaxed text-[#444]"
            >
              Legacy Locker is a yearlong gift that delivers monthly story cards—
              <span className="bg-legacy-gold/30 px-1 rounded-sm">personalized</span>, 
              <span className="bg-legacy-gold/30 px-1 rounded-sm">illustrated</span>, 
              and <span className="bg-legacy-gold/30 px-1 rounded-sm">unforgettable</span>.
              Give it any time of year to offer celebration, connection, and reflection—month after month.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[clamp(20px,2.2vw,28px)] leading-relaxed text-[#444]"
            >
              <span className="inline-block mr-2">🎁</span> 
              <span className="bg-legacy-gold/20 px-1 rounded-sm">{displayText}</span>—now is the perfect moment to kick off their year of stories. We'll celebrate {nextHoliday?.name} and every other milestone that matters in the year ahead.
            </motion.p>
          </div>

          {/* Step 1 Block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-[clamp(20px,2vw,26px)] leading-relaxed space-y-12"
          >
            <div className="space-y-4">
              <div className="text-[clamp(24px,2.4vw,32px)]">
                <span className="font-bold bg-legacy-green/10 px-3 py-1 rounded-md">
                  1. Choose a story series that your recipient will connect with
                </span>
              </div>

              <p>You can select from our curated collection—stories like...</p>

              {formatStoriesList()}

              <div>
                <a 
                  href="#signature-editions" 
                  className="inline-flex items-center gap-1 px-3 py-1 bg-legacy-green/10 hover:bg-legacy-green/15 text-legacy-green font-medium rounded-sm transition-colors group text-[clamp(20px,2vw,26px)]"
                >
                  Explore Signature Editions
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <p>
                Or craft something more personal with custom artwork and stories from your life or theirs—like...
              </p>

              <div className="space-y-2 pl-4">
                <p>
                  <button 
                    className="dotted-underline text-legacy-green" 
                    onClick={() => handleThemeSelect("Your Childhood")}
                  >
                    your childhood
                  </button>{" "}
                  <span className="text-[#666] italic text-[0.95em]">parents love this</span>
                </p>
                <p>
                  <button 
                    className="dotted-underline text-legacy-green" 
                    onClick={() => handleThemeSelect("Your Relationship")}
                  >
                    your relationship
                  </button>{" "}
                  <span className="text-[#666] italic text-[0.95em]">a favorite for partners</span>
                </p>
                <p>
                  or{" "}
                  <button 
                    className="dotted-underline text-legacy-green" 
                    onClick={() => handleThemeSelect("Family History")}
                  >
                    your family's story
                  </button>{" "}
                  <span className="text-[#666] italic text-[0.95em]">our concierge team can even help you uncover your family's history</span>
                </p>
              </div>

              <div>
                <a 
                  href="#custom-editions" 
                  className="inline-flex items-center gap-1 px-3 py-1 bg-legacy-green/10 hover:bg-legacy-green/15 text-legacy-green font-medium rounded-sm transition-colors group text-[clamp(20px,2vw,26px)]"
                >
                  Explore Custom Editions
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Step 2 Block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-[clamp(20px,2vw,26px)] leading-relaxed space-y-12"
          >
            <div className="space-y-4">
              <div className="text-[clamp(24px,2.4vw,32px)]">
                <span className="font-bold bg-[#F5E6D3]/80 px-3 py-1 rounded-md">
                  2. Customize your cards
                </span>
              </div>

              <p>
                by adding personal notes to celebrate milestones throughout the year.  
                Whether it's <span className="bg-legacy-gold/20 px-1 rounded-sm">birthdays</span>,  
                <span className="bg-legacy-gold/20 px-1 rounded-sm">anniversaries</span>,  
                <span className="bg-legacy-gold/20 px-1 rounded-sm">Mother's Day</span>, or just a moment that matters,  
                your note shows up right on the card, exactly when it should.
              </p>
            </div>
          </motion.div>

          {/* Step 3 Block */}
          <FadeSection>
            <FadeContent isLastInSection>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-[clamp(20px,2vw,26px)] leading-relaxed space-y-12"
              >
                <div className="space-y-4">
                  <div className="text-[clamp(24px,2.4vw,32px)]">
                    <span className="font-bold bg-[#E6F3F5]/80 px-3 py-1 rounded-md">
                      3. We handle the rest
                    </span>
                  </div>

                  <p>
                    while you rest easy knowing each story will arrive  
                    printed on premium archival stock, packaged with care,  
                    and timed to land right when it matters.
                  </p>
                </div>
              </motion.div>
            </FadeContent>
          </FadeSection>
        </div>
      </div>
    </section>
  );
}; 