
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, MessageSquare } from "lucide-react";

interface CoachingStepProps {
  handleNextStep: () => void;
  handlePreviousStep: () => void;
}

const CoachingStep: React.FC<CoachingStepProps> = ({ handleNextStep }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-legacy-cream/50">
      <div className="bg-legacy-green/10 p-4 border-b border-legacy-cream/30">
        <h2 className="text-2xl font-medium text-center text-legacy-green">How to Find Your Stories</h2>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="flex items-start gap-4">
          <MessageSquare className="h-8 w-8 text-legacy-green flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-medium mb-2">Tips for Finding Memories</h3>
            <ul className="list-disc pl-5 space-y-2 text-legacy-dark/80">
              <li><strong>Check your photo albums</strong> - both digital and physical</li>
              <li><strong>Browse social media timelines</strong> - Facebook memories, Instagram highlights</li>
              <li><strong>Look through your calendar</strong> - important dates often hold significant memories</li>
              <li><strong>Talk to friends and family</strong> - they might remember stories you've forgotten</li>
              <li><strong>Consider sensory memories</strong> - foods, smells, or songs that transport you</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-legacy-cream/30 p-5 rounded-md">
          <h4 className="font-medium mb-3 text-legacy-green">Memory Prompts for Each Month</h4>
          <ul className="list-disc pl-5 space-y-2 text-legacy-dark/80">
            <li><strong>January:</strong> A fresh beginning or new chapter</li>
            <li><strong>February:</strong> A meaningful relationship or connection</li>
            <li><strong>March:</strong> A time you showed courage or resilience</li>
            <li><strong>April:</strong> A moment of growth or renewal</li>
            <li><strong>May:</strong> A celebration or achievement</li>
            <li><strong>June:</strong> An adventure or journey</li>
            <li><strong>July:</strong> A moment of joy or freedom</li>
            <li><strong>August:</strong> A valuable lesson learned</li>
            <li><strong>September:</strong> A transition or change</li>
            <li><strong>October:</strong> A tradition or ritual</li>
            <li><strong>November:</strong> Something you're thankful for</li>
            <li><strong>December:</strong> A moment that brings reflection</li>
          </ul>
        </div>
      </div>
      
      <div className="flex justify-end p-4 border-t border-legacy-cream/30">
        <Button 
          onClick={handleNextStep}
          className="bg-legacy-green text-white hover:bg-legacy-green/90"
        >
          Next: About Your Custom Edition
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default CoachingStep;
