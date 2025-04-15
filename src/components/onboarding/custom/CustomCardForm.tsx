import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CustomCardData } from '@/lib/sessionManager';

interface CustomCardFormProps {
  selectedMonth: string;
  currentCardData: CustomCardData;
  handleCardDataChange: (field: keyof CustomCardData, value: any) => void;
  handlePhotoUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomCardForm: React.FC<CustomCardFormProps> = ({
  selectedMonth,
  currentCardData,
  handleCardDataChange,
  handlePhotoUpload
}) => {
  const useExactText = currentCardData.useExactText === undefined ? false : currentCardData.useExactText;
  const useExactTitle = currentCardData.useExactTitle === undefined ? false : currentCardData.useExactTitle;
  const artworkOption = currentCardData.artworkOption || 'from-story';

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-legacy-cream/50 mb-6">
      <h3 className="text-xl font-semibold text-legacy-dark">Create {selectedMonth}'s Card</h3>
      
      {/* Section 1: Card Title */}
      <div className="space-y-3">
        <div className="pb-1 border-b border-legacy-cream/50 flex items-center justify-between">
          <h3 className="font-medium text-sm text-legacy-green uppercase tracking-wide">Card Title</h3>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Label htmlFor="cardTitle" className="text-base font-medium">Title</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="w-72 p-3">
                  <p>A short headline that captures the essence of this memory.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input 
            id="cardTitle"
            className="h-10 text-base"
            placeholder='e.g., "The First Snowfall" or "You Always Knew"'
            value={currentCardData.title || ''}
            onChange={(e) => handleCardDataChange('title', e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="useExactTitle"
              checked={useExactTitle}
              onChange={(e) => handleCardDataChange('useExactTitle', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-legacy-green focus:ring-legacy-green"
            />
            <Label htmlFor="useExactTitle" className="text-sm text-muted-foreground">
              Use this exact title (no editing)
            </Label>
          </div>
          <p className="text-xs text-muted-foreground italic">
            Short and sweet titles work best — or just jot the idea and we'll finesse it.
          </p>
        </div>
      </div>
      
      {/* Section 2: Your Story */}
      <div className="space-y-3">
        <div className="pb-1 border-b border-legacy-cream/50 flex items-center justify-between">
          <h3 className="font-medium text-sm text-legacy-green uppercase tracking-wide">Your Story</h3>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Label htmlFor="story" className="text-base font-medium">Tell your story</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="w-80 p-3">
                  <p>Share a short story, milestone, or reflection that captures this moment in your journey.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Textarea 
            id="story"
            className="min-h-[150px] max-h-[300px] text-base p-3"
            placeholder="Tell your story — we'll help turn it into magic."
            value={currentCardData.story || ''}
            onChange={(e) => handleCardDataChange('story', e.target.value)}
          />
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="useExactText"
              checked={useExactText}
              onChange={(e) => handleCardDataChange('useExactText', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-legacy-green focus:ring-legacy-green"
            />
            <Label htmlFor="useExactText" className="text-sm text-muted-foreground">
              Use this exact text (no editing)
            </Label>
          </div>
          
          <p className="text-xs text-muted-foreground italic">
            We'll keep your voice. Just give us the ideas — we'll do the writing.
          </p>
          
          {!useExactText && currentCardData.story && (
            <div className="bg-legacy-gold/5 border border-legacy-gold/20 p-3 rounded-md mt-1">
              <p className="text-sm text-legacy-dark flex items-start gap-2">
                <span>
                  Our team will craft a compelling story based on your input.
                  You'll receive an email within 48 hours with our draft for your approval.
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Section 3: Card Visual Style */}
      <div className="space-y-3">
        <div className="pb-1 border-b border-legacy-cream/50">
          <h3 className="font-medium text-sm text-legacy-green uppercase tracking-wide">Choose Your Artwork Style</h3>
        </div>

        <RadioGroup 
          value={artworkOption} 
          onValueChange={(value) => handleCardDataChange('artworkOption', value)}
          className="space-y-2.5"
        >
          <div className={`border rounded-lg p-3 cursor-pointer transition-all ${artworkOption === 'use-photo' ? 'border-legacy-green bg-legacy-green/5' : 'border-gray-200'}`}>
            <div className="flex gap-3">
              <RadioGroupItem value="use-photo" id="use-photo" className="mt-0.5" />
              <div>
                <Label htmlFor="use-photo" className="font-medium text-base cursor-pointer">Use My Photo</Label>
                <p className="text-sm text-legacy-dark/70">We'll print it directly on your card.</p>
              </div>
            </div>
            
            {artworkOption === 'use-photo' && handlePhotoUpload && (
              <div className="mt-3 ml-7">
                <label htmlFor={`photo-upload-use-${selectedMonth}`} className="cursor-pointer">
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition">
                    <div className="space-y-1 text-center">
                      <Button variant="ghost" className="h-auto p-1">
                        {currentCardData.photoUrl ? (
                          <span className="text-legacy-green">Change photo ({currentCardData.photoUrl})</span>
                        ) : (
                          <span className="text-legacy-green">Upload a photo</span>
                        )}
                      </Button>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, or GIF up to 5MB
                      </p>
                    </div>
                  </div>
                </label>
                <input 
                  id={`photo-upload-use-${selectedMonth}`} 
                  type="file" 
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </div>
            )}
          </div>
          
          <div className={`border rounded-lg p-3 cursor-pointer transition-all ${artworkOption === 'from-photo' ? 'border-legacy-green bg-legacy-green/5' : 'border-gray-200'}`}>
            <div className="flex gap-3">
              <RadioGroupItem value="from-photo" id="from-photo" className="mt-0.5" />
              <div>
                <Label htmlFor="from-photo" className="font-medium text-base cursor-pointer">Turn My Photo Into Art</Label>
                <p className="text-sm text-legacy-dark/70">We'll transform your image into a custom illustration.</p>
              </div>
            </div>
            
            {artworkOption === 'from-photo' && handlePhotoUpload && (
              <div className="mt-3 ml-7">
                <label htmlFor={`photo-upload-transform-${selectedMonth}`} className="cursor-pointer">
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition">
                    <div className="space-y-1 text-center">
                      <Button variant="ghost" className="h-auto p-1">
                        {currentCardData.photoUrl ? (
                          <span className="text-legacy-green">Change photo ({currentCardData.photoUrl})</span>
                        ) : (
                          <span className="text-legacy-green">Upload a photo</span>
                        )}
                      </Button>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, or GIF up to 5MB
                      </p>
                    </div>
                  </div>
                </label>
                <input 
                  id={`photo-upload-transform-${selectedMonth}`} 
                  type="file" 
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </div>
            )}
          </div>
          
          <div className={`border rounded-lg p-3 cursor-pointer transition-all ${artworkOption === 'from-story' ? 'border-legacy-green bg-legacy-green/5' : 'border-gray-200'}`}>
            <div className="flex gap-3">
              <RadioGroupItem value="from-story" id="from-story" className="mt-0.5" />
              <div>
                <Label htmlFor="from-story" className="font-medium text-base cursor-pointer">Create Art From My Story</Label>
                <p className="text-sm text-legacy-dark/70">No photo needed — we'll read your story and bring it to life.</p>
              </div>
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default CustomCardForm; 