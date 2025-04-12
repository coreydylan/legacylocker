
import React from 'react';
import { BookOpen, PenLine, ConciergeBell } from 'lucide-react';

const EditionTypesExplainer = () => {
  return (
    <section className="w-full py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-2 h-1 w-24 bg-legacy-gold mx-auto"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-playfair text-legacy-dark">
            Choose Your Perfect Legacy Experience
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-legacy-cream/30 hover:bg-legacy-cream/50 transition-colors">
              <div className="flex justify-center mb-4">
                <div className="bg-legacy-green/10 p-4 rounded-full">
                  <BookOpen className="h-8 w-8 text-legacy-green" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-3 font-playfair">Signature Editions</h3>
              <p className="text-legacy-dark/80">
                Curated collections of stories about iconic moments, places, and movements. 
                Professionally written and researched with monthly personalization options.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-legacy-cream/30 hover:bg-legacy-cream/50 transition-colors">
              <div className="flex justify-center mb-4">
                <div className="bg-legacy-green/10 p-4 rounded-full">
                  <PenLine className="h-8 w-8 text-legacy-green" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-3 font-playfair">Custom Editions</h3>
              <p className="text-legacy-dark/80">
                Tell your own story with our guided 12-card creation process. 
                Share memories, milestones, and meaningful moments in your own words.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-legacy-green/5 hover:bg-legacy-green/10 transition-colors border-2 border-legacy-gold/30">
              <div className="flex justify-center mb-4">
                <div className="bg-legacy-gold/10 p-4 rounded-full">
                  <ConciergeBell className="h-8 w-8 text-legacy-gold" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-3 font-playfair">Concierge Editions</h3>
              <p className="text-legacy-dark/80">
                Work directly with our professional writers to craft a completely bespoke story series. 
                Perfect for complex narratives or special gifts.
              </p>
              <span className="inline-block mt-3 bg-legacy-gold text-white text-xs px-2 py-1 rounded">
                Premium Service
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditionTypesExplainer;
