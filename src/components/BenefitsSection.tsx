
import React from 'react';
import { Calendar, BookOpen, Gift } from 'lucide-react';

const benefits = [
  {
    icon: <Calendar className="h-12 w-12 text-legacy-gold" />,
    title: "A Gift That Deepens Over Time",
    description: "Thoughtful, month-by-month delivery means the gesture keeps growing — not fading."
  },
  {
    icon: <BookOpen className="h-12 w-12 text-legacy-gold" />,
    title: "Professionally Written, Beautifully Designed",
    description: "Every card features a unique story paired with custom illustrations and optional personal messages."
  },
  {
    icon: <Gift className="h-12 w-12 text-legacy-gold" />,
    title: "Effortless to Give, Unforgettable to Receive",
    description: "You handle a few minutes of setup. We handle the surprise and delight for the next 12 months."
  }
];

const BenefitsSection = () => {
  return (
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair text-legacy-dark mb-6">
            Why people love Legacy Locker
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="text-center p-8 border border-legacy-cream rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="inline-flex items-center justify-center rounded-full bg-legacy-green/5 p-6 mb-6">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 font-playfair">{benefit.title}</h3>
              <p className="text-legacy-dark/80">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
