
import React from 'react';
import { Badge } from "@/components/ui/badge"; 

interface EditionTypeCardProps {
  title: string;
  description: string;
  isPremium?: boolean;
  onClick: () => void;
}

const EditionTypeCard: React.FC<EditionTypeCardProps> = ({
  title,
  description,
  isPremium = false,
  onClick,
}) => {
  return (
    <div 
      className={`${isPremium ? 'bg-legacy-gold/5' : 'bg-white'} p-6 rounded-lg shadow-md border-2 transition-all duration-300 cursor-pointer ${isPremium ? 'border-legacy-gold hover:border-legacy-gold/80' : 'hover:border-legacy-green border-transparent'}`}
      onClick={onClick}
    >
      <div className="h-40 mb-4 bg-legacy-cream/50 rounded flex items-center justify-center">
        <span className={`font-playfair ${isPremium ? 'text-legacy-gold' : 'text-legacy-green'} text-xl`}>
          {title}
        </span>
      </div>
      <h3 className="text-lg font-medium mb-1 font-playfair">
        {title}
      </h3>
      <p className="text-sm text-legacy-dark/70">
        {description}
      </p>
      {isPremium && (
        <div className="mt-3 w-full">
          <Badge variant="gold" className="font-medium">Premium Service</Badge>
        </div>
      )}
    </div>
  );
};

export default EditionTypeCard;
