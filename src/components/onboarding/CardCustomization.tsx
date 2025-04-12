import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { ImageIcon, Lock, Unlock, CheckCircle } from 'lucide-react';

interface CardInfo {
  title: string;
  story: string;
  imageType: 'ai' | 'upload' | 'none';
  imageUrl?: string;
  isLocked?: boolean;
}

interface CardCustomizationProps {
  cards: {
    [month: string]: CardInfo;
  };
  onUpdate: (month: string, field: string, value: any) => void;
  onNext: () => void;
}

const MONTHS = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun', 
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
];

const MONTH_NAMES = {
  jan: 'January',
  feb: 'February',
  mar: 'March',
  apr: 'April',
  may: 'May',
  jun: 'June',
  jul: 'July',
  aug: 'August',
  sep: 'September',
  oct: 'October',
  nov: 'November',
  dec: 'December'
};

const CardCustomization: React.FC<CardCustomizationProps> = ({ 
  cards, 
  onUpdate,
  onNext
}) => {
  const [activeMonth, setActiveMonth] = useState('jan');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  
  // Calculate progress - how many cards have content
  const completedCards = Object.entries(cards).filter(
    ([_, card]) => card.title.trim() !== '' && card.story.trim() !== ''
  ).length;
  
  const progress = Math.round((completedCards / 12) * 100);
  
  // Handle card locking - prevents further edits
  const toggleLock = (month: string) => {
    onUpdate(month, 'isLocked', !cards[month].isLocked);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-legacy-green mb-2">
          Personalize Your Cards
        </h1>
        <p className="text-gray-600">
          Create personalized cards for each month of the year.
        </p>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-6">
          <div 
            className="bg-legacy-green h-2.5 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {completedCards} of 12 cards completed
        </p>
      </div>

      <Tabs
        value={activeMonth}
        onValueChange={setActiveMonth}
        className="w-full"
      >
        <TabsList className="grid grid-cols-6 md:grid-cols-12 mb-6">
          {MONTHS.map((month) => (
            <TabsTrigger 
              key={month} 
              value={month}
              className="relative"
            >
              {month.substring(0, 1).toUpperCase()}
              {cards[month].isLocked && (
                <Lock className="w-3 h-3 absolute -top-1 -right-1 text-legacy-green" />
              )}
              {cards[month].title && cards[month].story && !cards[month].isLocked && (
                <CheckCircle className="w-3 h-3 absolute -top-1 -right-1 text-legacy-green" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {MONTHS.map((month) => (
          <TabsContent key={month} value={month}>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{MONTH_NAMES[month as keyof typeof MONTH_NAMES]}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`lock-${month}`}>
                      {cards[month].isLocked ? 'Unlock' : 'Lock'}
                    </Label>
                    <Switch
                      id={`lock-${month}`}
                      checked={!!cards[month].isLocked}
                      onCheckedChange={() => toggleLock(month)}
                    />
                  </div>
                </div>
                <CardDescription>
                  Personalize your {MONTH_NAMES[month as keyof typeof MONTH_NAMES]} card
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Title input */}
                <div className="space-y-2">
                  <Label htmlFor={`title-${month}`}>Card Title</Label>
                  <Input
                    id={`title-${month}`}
                    placeholder="Enter a title for this card"
                    value={cards[month].title}
                    onChange={(e) => onUpdate(month, 'title', e.target.value)}
                    disabled={cards[month].isLocked}
                  />
                </div>
                
                {/* Story input */}
                <div className="space-y-2">
                  <Label htmlFor={`story-${month}`}>Your Story</Label>
                  <Textarea
                    id={`story-${month}`}
                    placeholder="Share your memory or story for this month..."
                    rows={6}
                    value={cards[month].story}
                    onChange={(e) => onUpdate(month, 'story', e.target.value)}
                    disabled={cards[month].isLocked}
                    className="resize-none"
                  />
                </div>
                
                {/* Image selection */}
                <div className="space-y-2">
                  <Label>Card Image</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className={`flex flex-col h-24 items-center justify-center ${
                        cards[month].imageType === 'ai' ? 'border-2 border-legacy-green' : ''
                      }`}
                      onClick={() => onUpdate(month, 'imageType', 'ai')}
                      disabled={cards[month].isLocked}
                    >
                      <div className="text-legacy-green mb-1">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                      <span className="text-xs">AI Generated</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className={`flex flex-col h-24 items-center justify-center ${
                        cards[month].imageType === 'upload' ? 'border-2 border-legacy-green' : ''
                      }`}
                      onClick={() => onUpdate(month, 'imageType', 'upload')}
                      disabled={cards[month].isLocked}
                    >
                      <div className="text-legacy-green mb-1">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                      <span className="text-xs">Upload Photo</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className={`flex flex-col h-24 items-center justify-center ${
                        cards[month].imageType === 'none' ? 'border-2 border-legacy-green' : ''
                      }`}
                      onClick={() => onUpdate(month, 'imageType', 'none')}
                      disabled={cards[month].isLocked}
                    >
                      <div className="text-legacy-green mb-1">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                      <span className="text-xs">No Image</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => {
                    const prevIndex = MONTHS.indexOf(activeMonth) - 1;
                    if (prevIndex >= 0) {
                      setActiveMonth(MONTHS[prevIndex]);
                    }
                  }}
                  disabled={activeMonth === MONTHS[0]}
                >
                  Previous
                </Button>
                
                {activeMonth !== MONTHS[MONTHS.length - 1] ? (
                  <Button 
                    onClick={() => {
                      const nextIndex = MONTHS.indexOf(activeMonth) + 1;
                      if (nextIndex < MONTHS.length) {
                        setActiveMonth(MONTHS[nextIndex]);
                      }
                    }}
                  >
                    Next Card
                  </Button>
                ) : (
                  <Button onClick={onNext}>
                    Continue to Review
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="mt-8 text-center">
        <Button
          variant="default"
          size="lg"
          onClick={onNext}
          className="px-8"
        >
          Review All Cards
        </Button>
      </div>
    </div>
  );
};

export default CardCustomization; 