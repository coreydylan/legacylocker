import React, { useState } from 'react';
import { CardBackBuilder } from '@/components/CardBackBuilder';

const CardBuilderDemo: React.FC = () => {
  const [cardData, setCardData] = useState({
    customNote: 'Custom note example',
    cardNumber: 1,
    totalCards: 12,
    editionTitle: 'ATLANTA BASEBALL EDITION',
    giftFromCopy: 'A GIFT FROM LUKAS TO MOM',
    headline: 'Your Story Headline',
    subtitle: 'YOUR STORY SUBTITLE',
    storyBody: 'Your story text goes here...',
    badgeText: 'NEW',
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