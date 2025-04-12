
import React from 'react';
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronRight } from "lucide-react";

interface IntroStepProps {
  handleNextStep: () => void;
}

const IntroStep: React.FC<IntroStepProps> = ({ handleNextStep }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-legacy-cream/50">
      <div className="bg-legacy-green/10 p-4 border-b border-legacy-cream/30">
        <h2 className="text-2xl font-medium text-center text-legacy-green">Welcome to Your Custom Edition</h2>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="flex items-start gap-4">
          <BookOpen className="h-8 w-8 text-legacy-green flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-medium mb-2">Create Your Story</h3>
            <p className="text-legacy-dark/80">
              Over the next 12 cards, you'll craft a unique series of memories that tell your story.
              Each card represents a chapter in your journey, and you can personalize every detail.
            </p>
          </div>
        </div>
        
        <div className="bg-legacy-cream/20 p-5 rounded-lg border border-legacy-cream/30">
          <h3 className="text-lg font-medium mb-3 text-legacy-green">How It Works</h3>
          <ul className="list-disc pl-5 space-y-3 text-legacy-dark/80">
            <li>
              <strong>Your Stories, Your Way</strong>
              <p className="mt-1 text-sm">Write your own memories exactly as you want them, or let our professional writers craft polished stories from your ideas.</p>
            </li>
            <li>
              <strong>Personalized Artwork</strong>
              <p className="mt-1 text-sm">Upload your own photos to print directly, transform them into artwork, or let us create original illustrations based on your stories.</p>
            </li>
            <li>
              <strong>Collaborate With Confidence</strong>
              <p className="mt-1 text-sm">When we help with writing or artwork, you'll always review and approve before anything goes to print.</p>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="flex justify-end p-4 border-t border-legacy-cream/30">
        <Button 
          onClick={handleNextStep}
          className="bg-legacy-green text-white hover:bg-legacy-green/90"
        >
          Start Creating
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default IntroStep;
