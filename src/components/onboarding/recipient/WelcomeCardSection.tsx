import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface WelcomeCardSectionProps {
  includeWelcomeCard: boolean;
  welcomeMessage: string | undefined;
  onToggleCard: (checked: boolean) => void;
  onMessageChange: (message: string) => void;
}

const CHARACTER_LIMIT = 1700;

const WelcomeCardSection: React.FC<WelcomeCardSectionProps> = ({
  includeWelcomeCard,
  welcomeMessage,
  onToggleCard,
  onMessageChange,
}) => {
  const [charactersUsed, setCharactersUsed] = useState(0);
  
  useEffect(() => {
    setCharactersUsed(welcomeMessage?.length || 0);
  }, [welcomeMessage]);
  
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= CHARACTER_LIMIT) {
      onMessageChange(value);
    }
  };

  return (
    <div className="space-y-4 mt-8">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="includeWelcomeCard" className="text-base">Include Welcome Card</Label>
          <p className="text-sm text-muted-foreground">
            Add a personalized welcome card to introduce the gift
          </p>
        </div>
        <Switch 
          id="includeWelcomeCard"
          checked={includeWelcomeCard}
          onCheckedChange={onToggleCard}
        />
      </div>

      {includeWelcomeCard && (
        <div className="space-y-2">
          <Label htmlFor="welcomeMessage" className="text-base">Welcome Message</Label>
          <p className="text-sm text-muted-foreground mb-2">
            We can ship a special welcome card with the first story card. This is your chance to add a personal touch to the first shipment—something heartfelt, funny, or meaningful. What message would you like to include?
          </p>
          <Textarea
            id="welcomeMessage"
            className="min-h-[150px] text-base"
            placeholder="Write a personal message to introduce this gift..."
            value={welcomeMessage || ''}
            onChange={handleMessageChange}
            maxLength={CHARACTER_LIMIT}
          />
          <div className="text-sm text-muted-foreground text-right mt-1">
            <span className={charactersUsed >= CHARACTER_LIMIT ? "text-red-500 font-medium" : ""}>
              {charactersUsed}/{CHARACTER_LIMIT} characters
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeCardSection;
