import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react'; // Or another suitable icon

interface CoachingCardsButtonProps {
  onClick: () => void;
}

const CoachingCardsButton: React.FC<CoachingCardsButtonProps> = ({ onClick }) => {
  return (
    // Styling can be adjusted - maybe smaller, different variant?
    // Position this appropriately in the parent component (e.g., top-right, top-left)
    <div className="max-w-3xl mx-auto mb-4">
      <Button 
        variant="outline"
        size="sm"
        onClick={onClick}
        className="text-legacy-green border-legacy-green/30 hover:bg-legacy-green/10"
      >
        <BookOpen className="h-4 w-4 mr-2" />
        Need a refresher? Open Coaching Cards
      </Button>
    </div>
  );
};

export default CoachingCardsButton; 