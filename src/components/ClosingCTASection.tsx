
import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, Gift, PenTool } from "lucide-react";

const ClosingCTASection = () => {
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
            Make them feel seen—month after month.
          </h2>
          
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-12 text-white/85">
            Whether gifting your parent, your partner, or your team, Legacy Locker delivers one meaningful card at a time. Stories that connect. Artwork they'll want to keep.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="bg-white hover:bg-white/90 text-legacy-green py-6 flex items-center justify-center gap-2"
            >
              <Heart className="h-5 w-5" />
              Subscribe Now
            </Button>
            
            <Button 
              className="bg-legacy-gold hover:bg-legacy-gold/90 text-white py-6 flex items-center justify-center gap-2"
            >
              <Gift className="h-5 w-5" />
              Give a Gift
            </Button>
            
            <Button 
              variant="outline"
              className="border-white text-white hover:bg-white/10 py-6 flex items-center justify-center gap-2"
            >
              <PenTool className="h-5 w-5" />
              Start a Custom Edition
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClosingCTASection;
