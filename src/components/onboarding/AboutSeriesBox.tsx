import React, { useMemo } from 'react';
import { SeriesType } from '@/types/onboarding';
import { useSessionStore } from '@/lib/sessionStore';

interface AboutSeriesBoxProps {
  className?: string;
}

const AboutSeriesBox: React.FC<AboutSeriesBoxProps> = ({ className = '' }) => {
  const { session } = useSessionStore();
  const selectedSeries = session.selectedSeries;

  const seriesInfo = useMemo(() => {
    if (!selectedSeries) return null;

    switch (selectedSeries.type) {
      case 'signature':
        return {
          title: "Signature Edition",
          description: "A curated collection of 12 beautifully crafted cards delivered monthly, each celebrating moments that connect with your chosen theme.",
          features: [
            "Monthly deliveries",
            "Professionally written stories",
            "Themed collection",
            "Personalized messages"
          ]
        };
      case 'custom':
        return {
          title: "Custom Edition",
          description: "A bespoke collection crafted specifically for you or your recipient, telling unique stories that matter most.",
          features: [
            "Personalized story collection",
            "Custom artwork options",
            "Flexible delivery schedule",
            "Your stories, your way"
          ]
        };
      case 'concierge':
        return {
          title: "Concierge Edition",
          description: "Our premium service with a dedicated writer to help craft your perfect story collection.",
          features: [
            "Dedicated story consultant",
            "Premium story development",
            "Unlimited revisions",
            "White-glove service"
          ]
        };
      default:
        return null;
    }
  }, [selectedSeries]);

  if (!selectedSeries || !seriesInfo) return null;

  return (
    <div className={`bg-white rounded-lg border-2 border-legacy-green/10 p-6 space-y-6 ${className}`}>
      <div className="space-y-2">
        <h3 className="text-xl font-medium text-legacy-green">
          {seriesInfo.title}
        </h3>
        <p className="text-legacy-dark/80 leading-relaxed">
          {seriesInfo.description}
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {seriesInfo.features.map((feature, index) => (
          <div 
            key={index}
            className="bg-legacy-cream/30 p-4 rounded-lg text-center"
          >
            <p className="text-sm font-medium text-legacy-dark/90">{feature}</p>
          </div>
        ))}
      </div>

      {/* Theme Context Box */}
      {selectedSeries.categoryName && (
        <div className="bg-legacy-cream/50 p-4 rounded-lg space-y-2">
          <h4 className="font-medium text-sm">Selected Theme</h4>
          <div className="flex items-center gap-2 text-legacy-dark/80 text-sm">
            <span className="font-medium">{selectedSeries.categoryName}</span>
            {selectedSeries.subcategoryName && (
              <>
                <span className="text-legacy-dark/40">•</span>
                <span>{selectedSeries.subcategoryName}</span>
              </>
            )}
            {selectedSeries.locationName && (
              <>
                <span className="text-legacy-dark/40">•</span>
                <span>{selectedSeries.locationName}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutSeriesBox;