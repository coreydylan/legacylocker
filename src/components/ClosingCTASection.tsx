import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, Gift, PenTool } from "lucide-react";

const ClosingCTASection = () => {
  // Function to scroll to story selector and open the dialog
  const handleScrollToStorySelector = () => {
    const storySelector = document.getElementById('story-selector');
    if (storySelector) {
      storySelector.scrollIntoView({ behavior: 'smooth' });
      
      // Open the story selector dialog after scrolling
      setTimeout(() => {
        const selectorButton = storySelector.querySelector('button[role="combobox"]');
        if (selectorButton && selectorButton instanceof HTMLElement) {
          selectorButton.click();
        }
      }, 800); // Add a delay to ensure scrolling completes before opening dialog
    }
  };

  return (
    <section className="w-full py-24 bg-legacy-green text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full border-8 border-white"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full border-8 border-legacy-gold"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 font-playfair">
            be known for your stories
          </h2>
          
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-12 text-white/85">
            Become a legend among your family, friends, and everyone lucky enough to receive your gift. Legacy Locker makes it effortless to send something unforgettable — not just once, but all year long. You bring the heart. We'll handle the magic.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="bg-white hover:bg-white/90 text-legacy-green py-6 flex items-center justify-center gap-2"
              onClick={handleScrollToStorySelector}
            >
              <Heart className="h-5 w-5" />
              Explore Story Themes
            </Button>
            
            <Button 
              className="bg-legacy-gold hover:bg-legacy-gold/90 text-white py-6 flex items-center justify-center gap-2"
              onClick={handleScrollToStorySelector}
            >
              <Gift className="h-5 w-5" />
              Tell A Custom Story
            </Button>
            
            <Button 
              className="border-2 border-white text-white hover:bg-white/10 py-6 flex items-center justify-center gap-2"
              onClick={handleScrollToStorySelector}
            >
              <PenTool className="h-5 w-5" />
              Connect with us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClosingCTASection;
