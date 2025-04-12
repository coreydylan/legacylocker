
import React from 'react';
import { Calendar, Mail, Star } from "lucide-react";

const features = [
  {
    icon: <Mail className="h-8 w-8 text-legacy-gold" />,
    title: "Monthly Delivery",
    description: "Each month brings a new chapter of your story, beautifully illustrated and delivered to their doorstep."
  },
  {
    icon: <Calendar className="h-8 w-8 text-legacy-gold" />,
    title: "Perfect Timing",
    description: "We ensure special cards arrive precisely on birthdays, anniversaries, and other milestone moments."
  },
  {
    icon: <Star className="h-8 w-8 text-legacy-gold" />,
    title: "Thoughtfully Crafted",
    description: "Every card is designed with premium materials and attention to detail, creating a keepsake they'll treasure."
  }
];

const HowItWorksSection = () => {
  return (
    <section className="w-full py-20 bg-legacy-cream">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-2 h-1 w-24 bg-legacy-gold mx-auto"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 font-playfair text-legacy-dark">
            Delivered monthly—exactly when it matters.
          </h2>
          
          <p className="text-lg text-center leading-relaxed mb-16 max-w-3xl mx-auto">
            Legacy Locker cards ship at the start of every month, but we also ensure special milestones like birthdays, anniversaries, or holidays arrive precisely when they're most meaningful. Just provide key dates during checkout, and we'll handle the rest.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg card-shadow text-center">
                <div className="h-16 w-16 rounded-full bg-legacy-green/10 flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 font-playfair">{feature.title}</h3>
                <p className="text-legacy-dark/80">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
