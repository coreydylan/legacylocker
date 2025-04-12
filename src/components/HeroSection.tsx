
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const HeroSection = () => {
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
    <section className="w-full py-20 md:py-32 bg-legacy-cream flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full border-8 border-legacy-green"></div>
        <div className="absolute top-1/2 -right-24 w-48 h-48 rounded-full border-8 border-legacy-gold"></div>
      </div>
      
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-10 relative z-10">
        <div className="w-full md:w-1/2 text-left">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in font-playfair text-legacy-green">
            The Gift That Lasts All Year
          </h1>
          
          <p className="text-lg md:text-xl mb-12 text-legacy-dark/80 animate-fade-in delay-150">
            Give someone the joy of discovering a new story about their past each month — personalized, illustrated, unforgettable.
          </p>
          
          <div className="flex justify-center md:justify-start animate-fade-in delay-300">
            <Button 
              className="bg-legacy-green hover:bg-legacy-green/90 text-white py-6 px-8 rounded text-lg"
              onClick={handleScrollToStorySelector}
            >
              Send a Gift Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 mt-10 md:mt-0 animate-fade-in delay-450">
          <Carousel className="w-full max-w-lg mx-auto">
            <CarouselContent>
              {[1, 2, 3].map((_, index) => (
                <CarouselItem key={index} className="flex justify-center">
                  <div className="h-full flex items-center justify-center p-1">
                    <img 
                      src="/lovable-uploads/004710e3-87a5-4295-8e50-1382f0a1a4d4.png" 
                      alt="Legacy Locker Card Sample" 
                      className="max-h-[500px] w-auto object-contain drop-shadow-xl transform rotate-3"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4 md:-left-10" />
            <CarouselNext className="-right-4 md:-right-10" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
