
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

const customOptions = [
  { 
    id: 'personal', 
    title: 'A personal story about me',
    description: 'Celebrate your own journey with cards highlighting key moments.'
  },
  { 
    id: 'loved-one', 
    title: 'The story of someone I love',
    description: 'Honor a special person with cards about their life and impact.'
  },
  { 
    id: 'family', 
    title: 'A family history',
    description: 'Includes option to work with our genealogist to uncover your heritage.'
  },
  { 
    id: 'organization', 
    title: 'The story of a business, organization, or community',
    description: 'Commemorate important milestones of a larger group or enterprise.'
  },
];

const CustomEditionFlow = () => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);

  return (
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto bg-legacy-cream p-8 md:p-12 rounded-lg card-shadow">
          <h2 className="text-3xl font-bold mb-6 font-playfair text-legacy-green">
            Want to tell a story we haven't written yet?
          </h2>
          
          <p className="text-lg mb-8">
            Legacy Locker can help you craft a custom edition celebrating a person, a place, a family, a company—even you.
          </p>
          
          <div className="mb-8">
            <RadioGroup onValueChange={setSelectedOption} value={selectedOption}>
              <div className="space-y-4">
                {customOptions.map((option) => (
                  <div 
                    key={option.id}
                    className={`flex items-start space-x-3 p-4 rounded-md border-2 transition-all duration-200 cursor-pointer hover:bg-legacy-gold/5 ${selectedOption === option.id ? 'border-legacy-gold bg-legacy-gold/5' : 'border-transparent bg-white'}`}
                    onClick={() => setSelectedOption(option.id)}
                  >
                    <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                    <div className="flex-1">
                      <Label 
                        htmlFor={option.id} 
                        className="text-base font-medium cursor-pointer block mb-1"
                      >
                        {option.title}
                      </Label>
                      <p className="text-sm text-legacy-dark/70">
                        {option.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
          
          <div className="text-center">
            <Button 
              disabled={!selectedOption}
              className="bg-legacy-green hover:bg-legacy-green/90 text-white py-6 px-8 rounded text-lg"
            >
              Great—let's build your edition
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-legacy-dark/70 mt-3">
              We'll walk you through a few quick questions to shape the 12-card journey.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomEditionFlow;
