import React, { useState } from 'react';
import { CardBackBuilder } from '@/components/CardBackBuilder';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { cn } from '../lib/utils';

const CardBuilderDemo: React.FC = () => {
  const [cardData, setCardData] = useState({
    customNote: 'Custom note example for the card footer',
    cardNumber: 1,
    totalCards: 12,
    editionTitle: 'ATLANTA BASEBALL EDITION',
    giftFromCopy: 'A GIFT FROM LUKAS TO MOM',
    headline: 'Your Story Headline Here',
    subtitle: 'YOUR STORY SUBTITLE TEXT',
    storyBody: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.',
    badgeText: 'BASEBALL',
    footerOn: true,
    frameColor: '#2C5530',
    cardDetailsBgColor: '#F9F5EC',
    badgeColor: '#ED9831',
    icons: [],
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Card Back Builder Demo</h1>
      <div className="max-w-[1200px] mx-auto">
            <CardBackBuilder
          customNote={cardData.customNote}
          cardNumber={cardData.cardNumber}
          totalCards={cardData.totalCards}
          editionTitle={cardData.editionTitle}
          giftFromCopy={cardData.giftFromCopy}
          headline={cardData.headline}
          subtitle={cardData.subtitle}
          storyBody={cardData.storyBody}
          badgeText={cardData.badgeText}
          footerOn={cardData.footerOn}
          frameColor={cardData.frameColor}
          cardDetailsBgColor={cardData.cardDetailsBgColor}
          badgeColor={cardData.badgeColor}
          icons={cardData.icons}
        />
      </div>
    </div>
  );
};

export default CardBuilderDemo; 