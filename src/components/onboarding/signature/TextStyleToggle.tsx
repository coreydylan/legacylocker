
import React from 'react';
import { Pen, Sparkles, Wand } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TextStyleToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  type: 'memory' | 'title';
  className?: string;
}

const TextStyleToggle: React.FC<TextStyleToggleProps> = ({
  value,
  onChange,
  type,
  className
}) => {
  const handleToggleChange = (value: string) => {
    onChange(value === 'exact');
  };

  return (
    <TooltipProvider>
      <div className={cn("flex flex-wrap items-center justify-center gap-2", className)}>
        <ToggleGroup 
          type="single" 
          value={value ? 'exact' : 'craft'} 
          onValueChange={handleToggleChange}
          className="w-full bg-gray-50 rounded-lg border border-gray-200 p-1"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem 
                value="exact" 
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 h-9 text-sm font-medium rounded-md transition-all", 
                  value 
                    ? "bg-legacy-green text-white hover:bg-legacy-green/90 shadow-sm" 
                    : "hover:bg-gray-100 text-legacy-dark/70"
                )}
              >
                <Pen className="h-3.5 w-3.5" />
                <span>Use my exact {type === 'memory' ? 'text' : 'title'}</span>
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent side="top" className="p-3 max-w-xs">
              <p className="text-sm">We'll use exactly what you write — no edits.</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem 
                value="craft" 
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 h-9 text-sm font-medium rounded-md transition-all", 
                  !value 
                    ? "bg-legacy-green text-white hover:bg-legacy-green/90 shadow-sm" 
                    : "hover:bg-gray-100 text-legacy-dark/70"
                )}
              >
                {type === 'memory' ? (
                  <Sparkles className="h-3.5 w-3.5" />
                ) : (
                  <Wand className="h-3.5 w-3.5" />
                )}
                <span>Let Legacy Locker {type === 'memory' ? 'craft it' : 'polish it'}</span>
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent side="top" className="p-3 max-w-xs">
              <p className="text-sm">
                We'll refine {type === 'memory' ? 'your story' : 'your title'} for you. You'll approve the final version.
              </p>
            </TooltipContent>
          </Tooltip>
        </ToggleGroup>
      </div>
    </TooltipProvider>
  );
};

export default TextStyleToggle;
