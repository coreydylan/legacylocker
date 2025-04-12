
import React from 'react';
import { Check } from "lucide-react";

const includedItems = [
  "12 illustrated cards, mailed monthly for one year",
  "Each card tied to a moment in history or your chosen theme",
  "Customized cards for special dates (birthdays, anniversaries, etc.)",
  "Museum-quality printing, designed and mailed with care",
  "Optional Add-ons: collector album, gift box, bonus cards"
];

const WhatYouGetSection = () => {
  return (
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-2 h-1 w-24 bg-legacy-gold mx-auto"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-playfair text-legacy-dark">
            Every subscription includes:
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <ul className="space-y-4">
                {includedItems.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-3 mt-1 h-5 w-5 rounded-full bg-legacy-green flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-legacy-cream p-6 rounded-lg card-shadow">
              <div className="relative">
                <div className="absolute -top-3 -left-3 w-full h-full bg-legacy-gold/20 rounded-lg"></div>
                <div className="absolute -top-6 -left-6 w-full h-full border-2 border-legacy-gold rounded-lg"></div>
                <div className="relative bg-white p-6 rounded-lg border border-gray-200 z-10">
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div 
                        key={item}
                        className="bg-legacy-cream aspect-[3/4] rounded flex items-center justify-center"
                      >
                        <span className="font-playfair text-legacy-green text-sm">Sample Card {item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <span className="font-playfair italic text-legacy-dark/70 text-sm">
                      Museum-quality cards, designed to be kept forever
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatYouGetSection;
