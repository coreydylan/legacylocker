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

  const handleScrollToNarrativeSection = () => {
    const narrativeSection = document.getElementById('how-it-works');
    if (narrativeSection) {
      narrativeSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full min-h-screen md:h-auto md:py-32 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Add the keyframes to the document */}
      <style>{shimmerKeyframes}</style>
      
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src="/styles/hero-window-with-two-cards.webp" 
          alt="Hero Background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container mx-auto px-6 flex flex-col h-screen md:h-auto relative z-10">
        <div className="w-full text-left animate-slide-in-from-left mt-28 md:mt-0">
          {/* Hero headline */}
          <div>
            <h1 className="text-[28px] md:text-[72px] leading-[1.1] font-bold mb-2 font-playfair text-legacy-green">
              stories
            </h1>
            <h1 className="text-[22px] md:text-[50px] leading-[1.1] font-normal mb-6 font-playfair text-legacy-green">
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
          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 text-[#444] leading-relaxed">
            <p className="text-[13px] md:text-[20px]">
              <span className="mr-2">🎨</span> we <span 
                className="bold-animate"
                style={{ fontWeight: 400 }}
                data-delay="1.5"
              >illustrate</span> them beautifully
            </p>
            <p className="text-[13px] md:text-[20px]">
              <span className="mr-2">✍️</span> <span 
                className="bold-animate"
                style={{ fontWeight: 400 }}
                data-delay="2.3"
              >craft</span> them thoughtfully
            </p>
            <p className="text-[13px] md:text-[20px]">
              <span className="mr-2">📦</span> <span 
                className="bold-animate"
                style={{ fontWeight: 400 }}
                data-delay="3.1"
              >package</span> them perfectly
            </p>
            <p className="text-[13px] md:text-[20px]">
              <span className="mr-2">📬</span> and <span 
                className="bold-animate"
                style={{ fontWeight: 400 }}
                data-delay="3.9"
              >mail</span> them automatically
            </p>
          </div>

          {/* Callout section */}
          <div className="mb-8 md:mb-12">
            <p className="text-base md:text-xl font-bold text-legacy-green mb-2 md:mb-4">the best part?</p>
            <p className="text-[11px] md:text-[18px] text-[#444]">
              <span className="font-bold text-legacy-green/90">you get the credit</span> for making their day —<br />
              again and again, <span 
                className="bold-animate"
                style={{ fontWeight: 400 }}
                data-delay="4.7"
              >for a whole year</span>
            </p>
          </div>
        </div>
        
        {/* Button container positioned at bottom on mobile */}
        <div className="flex justify-start mt-auto md:mt-0 mb-12 md:mb-0 animate-slide-in-from-left-delayed">
          <Button 
            className="w-full md:w-auto py-4 md:py-6 px-6 md:px-8 text-base md:text-lg bg-legacy-green hover:bg-legacy-green/90 text-white rounded justify-center"
            onClick={handleScrollToNarrativeSection}
          >
            tell me more
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
