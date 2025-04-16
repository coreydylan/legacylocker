import React from 'react';
import { motion } from 'framer-motion';
import { Gift, PenTool, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: <Gift className="h-10 w-10 text-legacy-gold" />,
    title: "SELECT AN EDITION",
    description: "Choose from our curated Signature Series, create a Custom Edition that tells a story about your life, or partner with our team for a fully bespoke Concierge experience."
  },
  {
    icon: <PenTool className="h-10 w-10 text-legacy-gold" />,
    title: "ADD YOUR PERSONAL TOUCH",
    description: "Each card can include personalized milestone messages — for birthdays, anniversaries, or moments that matter. Custom Editions offer full creative freedom, and Concierge lets our team do the writing for you."
  },
  {
    icon: <Package className="h-10 w-10 text-legacy-gold" />,
    title: "LEAVE THE MAGIC TO US",
    description: "We print on archival-quality stock, pack each card carefully in a rigid mailer, and time delivery for maximum delight. Your gift will arrive month after month, right on cue."
  }
];

const FeaturesSection = () => {
  return (
    <section id="how-it-works" className="w-full py-24 bg-legacy-cream/30 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full" style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23000000\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
          backgroundSize: '100px 100px'
        }}></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold font-playfair text-legacy-dark mb-6">
            every story starts with a spark
          </h2>
        </motion.div>
        
        <div className="relative max-w-6xl mx-auto">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-legacy-gold/20 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative z-10">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="bg-white rounded-xl shadow-md p-8 relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
                  <div className="absolute top-4 right-4 w-16 h-16 border-2 border-legacy-gold rounded-full"></div>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 relative">
                    <div className="h-20 w-20 rounded-full bg-legacy-green/10 flex items-center justify-center relative z-10">
                      {feature.icon}
                    </div>
                    {/* Sparkle effect */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 text-legacy-gold opacity-70">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-bold tracking-widest mb-4 font-jakarta text-legacy-green">{feature.title}</h3>
                    <p className="text-legacy-dark/80">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <motion.div 
          className="mt-20 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className="text-xl font-medium mb-6">And if they love it?</p>
          <p className="text-lg text-legacy-dark/80 mb-8">
            Easily renew, extend the story with a Volume Two, or upgrade to a Custom or Concierge Edition next year.
          </p>
          
          <Button 
            className="bg-legacy-green hover:bg-legacy-green/90 text-white py-6 px-8 rounded text-lg"
            onClick={() => document.getElementById('story-series')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Start Your Story
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
