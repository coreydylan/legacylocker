import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClearSessionButtonProps {
  onClick: () => void;
  className?: string;
}

const ClearSessionButton: React.FC<ClearSessionButtonProps> = ({ onClick, className }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn(
        "h-6 w-6 rounded-full text-destructive/70 hover:bg-destructive/10 hover:text-destructive",
        className
      )}
      aria-label="Clear session data"
    >
      <X className="h-4 w-4" />
    </Button>
  );
};

export default ClearSessionButton; 