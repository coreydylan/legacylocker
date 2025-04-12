
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

const PricingSection = () => {
  const handleScrollToStorySelector = (type: 'signature' | 'custom') => {
    const storySelector = document.getElementById('story-selector');
    if (storySelector) {
      storySelector.scrollIntoView({ behavior: 'smooth' });
      
      // Open the story selector dialog with the correct filter after scrolling
      setTimeout(() => {
        // First find the appropriate edition type card to click
        const editionTypeCards = storySelector.querySelectorAll('.card-container > div');
        if (editionTypeCards && editionTypeCards.length >= 2) {
          // Click on the first card for signature or second for custom
          const targetCard = type === 'signature' ? editionTypeCards[0] : editionTypeCards[1];
          if (targetCard && targetCard instanceof HTMLElement) {
            targetCard.click();
          }
        }
      }, 800); // Add a delay to ensure scrolling completes before opening dialog
    }
  };

  return (
    <section id="pricing" className="w-full py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair text-legacy-dark mb-6">
            Simple, Transparent Pricing
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Signature Series Plan */}
          <div className="border border-legacy-cream rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-legacy-cream/30 p-6">
              <h3 className="text-2xl font-bold font-playfair">Signature Series</h3>
              <div className="mt-4">
                <span className="text-3xl font-bold">$59</span>
                <span className="text-legacy-dark/80"> / one-time</span>
              </div>
            </div>
            
            <div className="p-6">
              <ul className="space-y-3">
                {["12 curated stories from a selected theme", 
                  "Beautifully illustrated monthly cards", 
                  "Optional milestone personalization"].map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="h-5 w-5 text-legacy-green mr-2 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full mt-8 bg-legacy-green hover:bg-legacy-green/90 text-white"
                onClick={() => handleScrollToStorySelector('signature')}
              >
                Choose a Series
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Custom Edition Plan */}
          <div className="border-2 border-legacy-gold rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative">
            <div className="absolute top-0 right-0">
              <span className="inline-block bg-legacy-gold text-white text-xs px-3 py-1 rounded-bl-lg">
                Most Popular
              </span>
            </div>
            
            <div className="bg-legacy-green/5 p-6">
              <h3 className="text-2xl font-bold font-playfair">Custom Edition</h3>
              <div className="mt-4">
                <span className="text-3xl font-bold">$99+</span>
                <span className="text-legacy-dark/80"> / one-time</span>
              </div>
            </div>
            
            <div className="p-6">
              <ul className="space-y-3">
                {["Fully personalized with your own stories", 
                  "Upload photos or let us illustrate", 
                  "Special delivery dates & custom messages"].map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="h-5 w-5 text-legacy-gold mr-2 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full mt-8 bg-legacy-gold hover:bg-legacy-gold/90 text-white"
                onClick={() => handleScrollToStorySelector('custom')}
              >
                Create a Custom Gift
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
