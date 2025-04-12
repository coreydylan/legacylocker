import React from 'react';
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SaveProgressButtonProps {
  onClick: () => void;
  lastSavedTime?: Date | null;
}

const SaveProgressButton: React.FC<SaveProgressButtonProps> = ({ onClick, lastSavedTime }) => {
  // Calculate time since last save if available
  const getLastSavedText = () => {
    if (!lastSavedTime) return null;
    
    try {
      const now = new Date();
      const diffMs = now.getTime() - lastSavedTime.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return "Saved just now";
      if (diffMins === 1) return "Saved 1 minute ago";
      if (diffMins < 60) return `Saved ${diffMins} minutes ago`;
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours === 1) return "Saved 1 hour ago";
      if (diffHours < 24) return `Saved ${diffHours} hours ago`;
      
      return "Saved earlier";
    } catch (error) {
      console.error("Error calculating saved time:", error);
      return null;
    }
  };

  return (
    <div className="flex flex-col items-end">
      <Button
        variant="outline"
        size="sm"
        onClick={onClick}
        className="text-legacy-green border-legacy-green/30 hover:bg-legacy-green/10"
      >
        <Save className="w-4 h-4 mr-2" />
        Save & Finish Later
      </Button>
      
      {lastSavedTime && (
        <span className="text-xs text-muted-foreground mt-1">
          {getLastSavedText()}
        </span>
      )}
    </div>
  );
};

export default SaveProgressButton;
