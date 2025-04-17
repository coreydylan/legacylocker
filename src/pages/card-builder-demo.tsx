import React, { useState } from 'react';
import CardBackBuilder from '@/components/CardBackBuilder';

const CardBuilderDemo: React.FC = () => {
  const [customNote, setCustomNote] = useState<string>('A special message for you on this card.');
  const [cardCount, setCardCount] = useState<string>('CARD 1 OF 12');
  const [editionText, setEditionText] = useState<string>('ATLANTA BASEBALL EDITION');
  const [giftFromCopy, setGiftFromCopy] = useState<string>('A GIFT FROM LUKAS TO MOM');
  const [headline, setHeadline] = useState<string>('The Day I Hit My First Home Run');
  const [subtitle, setSubtitle] = useState<string>('A BASEBALL MEMORY');
  const [storyBody, setStoryBody] = useState<string>(
    'It was a sunny Saturday afternoon in May 2010. The stands were packed with parents and siblings cheering on their little league teams. I was up to bat in the bottom of the 6th inning, with two outs and runners on second and third. Our team was down by one run.\n\n' +
    'The pitcher wound up and threw a fastball right down the middle. I swung with all my might, and the crack of the bat echoed through the park. The ball sailed high and far, clearing the left field fence by a good 20 feet.\n\n' +
    'As I rounded the bases, I could hear the crowd cheering and my teammates jumping up and down in the dugout. When I crossed home plate, my team mobbed me, and we went on to win the game 5-4.\n\n' +
    'That home run ball sits on my dresser to this day, a reminder of one of the greatest moments of my childhood. It wasn\'t just about the home run—it was about the feeling of accomplishment, the support of my team, and the joy of playing the game I love.'
  );
  const [badgeText, setBadgeText] = useState<string>('HOME RUN');
  const [footerOn, setFooterOn] = useState<boolean>(true);
  const [frameColor, setFrameColor] = useState<string>('#2C5530');
  const [cardDetailsBgColor, setCardDetailsBgColor] = useState<string>('#F9F5EC');
  const [badgeColor, setBadgeColor] = useState<string>('#ED9831');

  // Sample icons
  const icons = [
    '/icons/baseball.svg',
    '/icons/trophy.svg',
    '/icons/star.svg',
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Card Back Builder Demo</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <div className="border rounded overflow-hidden max-w-md mx-auto">
            <CardBackBuilder
              customNote={customNote}
              cardCount={cardCount}
              editionText={editionText}
              giftFromCopy={giftFromCopy}
              headline={headline}
              subtitle={subtitle}
              storyBody={storyBody}
              badgeText={badgeText}
              footerOn={footerOn}
              frameColor={frameColor}
              cardDetailsBgColor={cardDetailsBgColor}
              badgeColor={badgeColor}
              icons={icons}
            />
          </div>
        </div>
        
        {/* Controls */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Customize</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full p-2 border rounded"
                maxLength={25}
              />
              <p className="text-xs text-gray-500 mt-1">{headline.length}/25 characters</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value.toUpperCase())}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Story Body</label>
              <textarea
                value={storyBody}
                onChange={(e) => setStoryBody(e.target.value)}
                className="w-full p-2 border rounded h-40"
                maxLength={1700}
              />
              <p className="text-xs text-gray-500 mt-1">{storyBody.length}/1700 characters</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Card Count</label>
              <input
                type="text"
                value={cardCount}
                onChange={(e) => setCardCount(e.target.value.toUpperCase())}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Edition Text</label>
              <input
                type="text"
                value={editionText}
                onChange={(e) => setEditionText(e.target.value.toUpperCase())}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Gift From Copy</label>
              <input
                type="text"
                value={giftFromCopy}
                onChange={(e) => setGiftFromCopy(e.target.value.toUpperCase())}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Badge Text</label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value.toUpperCase())}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Custom Note</label>
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="footerOn"
                checked={footerOn}
                onChange={(e) => setFooterOn(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="footerOn" className="text-sm font-medium">Show Footer</label>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Frame Color</label>
              <div className="flex">
                <input
                  type="color"
                  value={frameColor}
                  onChange={(e) => setFrameColor(e.target.value)}
                  className="w-10 h-10 border rounded mr-2"
                />
                <input
                  type="text"
                  value={frameColor}
                  onChange={(e) => setFrameColor(e.target.value)}
                  className="flex-1 p-2 border rounded"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Card Details Background Color</label>
              <div className="flex">
                <input
                  type="color"
                  value={cardDetailsBgColor}
                  onChange={(e) => setCardDetailsBgColor(e.target.value)}
                  className="w-10 h-10 border rounded mr-2"
                />
                <input
                  type="text"
                  value={cardDetailsBgColor}
                  onChange={(e) => setCardDetailsBgColor(e.target.value)}
                  className="flex-1 p-2 border rounded"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Badge Color</label>
              <div className="flex">
                <input
                  type="color"
                  value={badgeColor}
                  onChange={(e) => setBadgeColor(e.target.value)}
                  className="w-10 h-10 border rounded mr-2"
                />
                <input
                  type="text"
                  value={badgeColor}
                  onChange={(e) => setBadgeColor(e.target.value)}
                  className="flex-1 p-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardBuilderDemo; 