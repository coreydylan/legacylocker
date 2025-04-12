
import React from 'react';
import { MessageSquare, Image, Star, Settings, Shield, RefreshCw } from 'lucide-react';

const features = [
  {
    icon: <MessageSquare className="h-8 w-8 text-legacy-gold" />,
    title: "Custom Messages",
    description: "Add optional notes for birthdays, anniversaries, or milestones."
  },
  {
    icon: <Image className="h-8 w-8 text-legacy-gold" />,
    title: "Illustrated Story Cards",
    description: "Archival-quality 4x6 cards printed monthly with original illustrations."
  },
  {
    icon: <Star className="h-8 w-8 text-legacy-gold" />,
    title: "Milestone Recognition",
    description: "We track birthdays, anniversaries, and more — you get the credit."
  },
  {
    icon: <Settings className="h-8 w-8 text-legacy-gold" />,
    title: "Effortless Setup",
    description: "Answer a few questions and we handle the rest."
  },
  {
    icon: <Shield className="h-8 w-8 text-legacy-gold" />,
    title: "Zero Spam, Zero Gimmicks",
    description: "No upsells, filler, or distractions. Just stories worth saving."
  },
  {
    icon: <RefreshCw className="h-8 w-8 text-legacy-gold" />,
    title: "Option to Renew or Expand",
    description: "Extend the series, add a volume two, or create a fully custom edition later."
  }
];

const FeaturesSection = () => {
  return (
    <section id="how-it-works" className="w-full py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair text-legacy-dark mb-6">
            A Smarter Way to Gift
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {features.map((feature, index) => (
            <div key={index} className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="h-12 w-12 rounded-full bg-legacy-green/10 flex items-center justify-center">
                  {feature.icon}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 font-playfair">{feature.title}</h3>
                <p className="text-legacy-dark/80">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
