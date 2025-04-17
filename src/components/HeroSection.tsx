import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// Define the shimmer animation keyframes
const shimmerKeyframes = `
  @keyframes shimmer {
    0% {
      background-position: -150% 0;
    }
    100% {
      background-position: 150% 0;
    }
  }

  @keyframes boldIn {
    0%, 20% {
      font-weight: 400;
    }
    80%, 100% {
      font-weight: 700;
    }
  }

  .bold-animate {
    animation: boldIn 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-play-state: paused;
  }

  .bold-animate.animate {
    animation-play-state: running;
  }
`;

const HeroSection = () => {
  React.useEffect(() => {
    // Add animate class to all elements after their respective delays
    const elements = document.querySelectorAll('.bold-animate');
    elements.forEach((element) => {
      const delay = element.getAttribute('data-delay');
      if (delay) {
        setTimeout(() => {
          element.classList.add('animate');
        }, parseFloat(delay) * 1000);
      }
    });
  }, []);

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
      {/* Add the keyframes to the document */}
      <style>{shimmerKeyframes}</style>
      
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full border-8 border-legacy-green"></div>
        <div className="absolute top-1/2 -right-24 w-48 h-48 rounded-full border-8 border-legacy-gold"></div>
      </div>
      
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-10 relative z-10">
        <div className="w-full md:w-1/2 text-left animate-slide-in-from-left">
          {/* Hero headline */}
          <div>
            <h1 className="text-[clamp(42px,6vw,72px)] leading-[1.1] font-bold mb-2 font-playfair text-legacy-green">
              stories
            </h1>
            <h1 className="text-[clamp(29px,4.2vw,50px)] leading-[1.1] font-normal mb-6 font-playfair text-legacy-green">
              <span>make </span>
              <span 
                className="relative inline-block"
                style={{
                  display: 'inline-block',
                  fontWeight: 'bold',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <span 
                  className="relative z-10"
                  style={{
                    background: 'linear-gradient(120deg, #2c5530, #4a7f4f, #2c5530)',
                    backgroundSize: '200% 100%',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'shimmer 4s ease-out infinite',
                    display: 'inline-block'
                  }}
                >
                  magical gifts
                </span>
              </span>
            </h1>
          </div>
          
          {/* Subtext */}
          <div className="space-y-4 text-[clamp(16px,1.25vw,20px)] mb-8 text-[#444] leading-relaxed">
            <p>
              <span className="mr-2">🎨</span> we <span 
                className="bold-animate"
                style={{ fontWeight: 400 }}
                data-delay="1.5"
              >illustrate</span> them beautifully
            </p>
            <p>
              <span className="mr-2">✍️</span> <span 
                className="bold-animate"
                style={{ fontWeight: 400 }}
                data-delay="2.3"
              >craft</span> them thoughtfully
            </p>
            <p>
              <span className="mr-2">📦</span> <span 
                className="bold-animate"
                style={{ fontWeight: 400 }}
                data-delay="3.1"
              >package</span> them perfectly
            </p>
            <p>
              <span className="mr-2">📬</span> and <span 
                className="bold-animate"
                style={{ fontWeight: 400 }}
                data-delay="3.9"
              >mail</span> them automatically
            </p>
          </div>

          {/* Callout section */}
          <div className="mb-12">
            <p className="text-xl font-bold text-legacy-green mb-4">the best part?</p>
            <p className="text-[clamp(14px,1.1vw,18px)] text-[#444]">
              <span className="font-bold text-legacy-green/90">you get the credit</span> for making their day —<br />
              again and again, <span 
                className="bold-animate"
                style={{ fontWeight: 400 }}
                data-delay="4.7"
              >for a whole year</span>
            </p>
          </div>
          
          <div className="flex justify-center md:justify-start animate-slide-in-from-left-delayed">
            <Button 
              className="bg-legacy-green hover:bg-legacy-green/90 text-white py-6 px-8 rounded text-lg"
              onClick={handleScrollToStorySelector}
            >
              start a story
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 mt-10 md:mt-0">
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/004710e3-87a5-4295-8e50-1382f0a1a4d4.png" 
              alt="Legacy Locker Card Sample" 
              className="max-h-[600px] w-auto object-contain drop-shadow-xl transform rotate-3"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
