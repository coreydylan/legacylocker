import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight } from 'lucide-react';
import { useSessionManager } from '@/hooks/useSessionManager';
import { useSessionStore } from '@/lib/sessionStore';
import { SeriesType } from '@/types/onboarding';
import { StoryOption } from '@/types/supabase';

interface PricingTier {
  title: string;
  price: string;
  description: string;
  features: string[];
  setupTime?: string;
  color: 'green' | 'gold' | 'orange';
  isPremium?: boolean;
  ctaText: string;
  editionType: 'signature' | 'custom' | 'concierge';
}

const pricingTiers: PricingTier[] = [
  {
    title: "Signature Edition",
    price: "$59",
    description: "For the meaning-maker who loves a great story.",
    features: [
      "12 archival-quality illustrated cards",
      "Choose from our curated library of themes — sports, music, local history, and more",
      "Artwork: Original illustrations on every card, tailored to the story",
      "Story: Historical or thematic moments tied to each month",
      "Add optional notes to celebrate personal milestones"
    ],
    setupTime: "Takes ~5 minutes to set up",
    color: 'green',
    ctaText: "Explore Story Themes",
    editionType: 'signature'
  },
  {
    title: "Custom Edition",
    price: "$99",
    description: "For those who want to tell their own story, their own way.",
    features: [
      "12 fully personalized, illustrated cards",
      "Artwork: Upload your own photo, request a custom illustration, or let us generate original visuals",
      "Story: Provide full stories or just the bullet points — we'll shape them into something beautiful",
      "Receive professional proofs within 48 hours",
      "Perfect for families, friendships, milestones"
    ],
    setupTime: "Takes 10–30 minutes to complete",
    color: 'gold',
    ctaText: "Tell A Custom Story",
    editionType: 'custom'
  },
  {
    title: "Concierge Edition",
    price: "$199+",
    description: "For stories that need a little more magic.",
    features: [
      "Work directly with our writers and in-house genealogist",
      "Perfect for complex life stories, family histories, or legacy gifts",
      "We help you uncover and shape your story from the ground up",
      "Includes personal consultations and white-glove service",
      "Limited availability"
    ],
    color: 'orange',
    ctaText: "Connect with us",
    editionType: 'concierge'
  }
];

interface StorySeriesPricingProps {
  onEditionSelect: (editionType: 'signature' | 'custom' | 'concierge') => void;
}

const StorySeriesPricing: React.FC<StorySeriesPricingProps> = ({ onEditionSelect }) => {
  const getColorClasses = (color: PricingTier['color']) => {
    switch (color) {
      case 'green':
        return 'border-legacy-green hover:border-legacy-green/80';
      case 'gold':
        return 'border-legacy-gold hover:border-legacy-gold/80';
      case 'orange':
        return 'border-orange-500 hover:border-orange-500/80';
      default:
        return '';
    }
  };

  const getBgColor = (color: PricingTier['color']) => {
    switch (color) {
      case 'green':
        return 'bg-legacy-green/5';
      case 'gold':
        return 'bg-legacy-gold/5';
      case 'orange':
        return 'bg-orange-500/5';
      default:
        return '';
    }
  };

  const getTextColor = (color: PricingTier['color']) => {
    switch (color) {
      case 'green':
        return 'text-legacy-green';
      case 'gold':
        return 'text-legacy-gold';
      case 'orange':
        return 'text-orange-500';
      default:
        return '';
    }
  };

  const handleEditionClick = (editionType: 'signature' | 'custom' | 'concierge') => {
    onEditionSelect(editionType);
  };

  return (
    <section className="w-full py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`border-2 ${getColorClasses(tier.color)} rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col`}
            >
              <div className={`${getBgColor(tier.color)} p-6 relative`}>
                <div className="flex justify-between items-start">
                  <h3 className={`text-2xl font-medium font-pangaia ${getTextColor(tier.color)}`}>
                    {tier.title}
                  </h3>
                  <span className="text-3xl font-bold">{tier.price}</span>
                </div>
                <p className="text-legacy-dark/70 mt-4">{tier.description}</p>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className={`h-5 w-5 ${getTextColor(tier.color)} mr-2 flex-shrink-0 mt-0.5`} />
                      <span className="text-legacy-dark/80">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-auto space-y-4">
                  {tier.setupTime && (
                    <p className="text-sm text-legacy-dark/60 text-center">{tier.setupTime}</p>
                  )}
                  
                  <Button
                    className={`w-full ${
                      tier.color === 'green' 
                        ? 'bg-legacy-green hover:bg-legacy-green/90' 
                        : tier.color === 'gold' 
                          ? 'bg-legacy-gold hover:bg-legacy-gold/90' 
                          : 'bg-orange-500 hover:bg-orange-500/90'
                    } text-white`}
                    onClick={() => handleEditionClick(tier.editionType)}
                  >
                    {tier.ctaText}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                  
                  {tier.isPremium && (
                    <div className="mt-4 text-center">
                      <Badge variant="gold" className="font-medium">Premium Service</Badge>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StorySeriesPricing; 