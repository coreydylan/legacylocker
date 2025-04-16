import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSessionStore } from '@/lib/sessionStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CoachingCard {
  id: number;
  title: string;
  content: React.ReactNode | ((edition: ReturnType<typeof useSessionStore.getState>['session']['selectedEdition']) => React.ReactNode); // Allow function for dynamic content
}

// Helper to parse label and return theme name + tips
const getEditionDetailsAndTips = (edition: ReturnType<typeof useSessionStore.getState>['session']['selectedEdition']): { themeName: string, tips: React.ReactNode } => {
  if (!edition || !edition.label) {
    return { themeName: "your chosen theme", tips: <p>Please select an edition to see relevant tips.</p> };
  }

  const { label } = edition;
  let themeName = "your chosen theme"; // Default
  let tips: React.ReactNode = <p>Start writing! Focus on moments and details.</p>; // Default tips

  // Try parsing format: "Top > Sub > Theme" (e.g., "Personal > Our Love Story") - Assuming only 2 or 3 parts after splitting
   if (label.includes(' > ')) {
       const parts = label.split(' > ');
       themeName = parts[parts.length - 1]?.trim() || themeName; // Get last part as theme name
        // --- Add specific tips based on themeName or category/subcategory (parts[0], parts[1]) ---
       if (themeName === "Our Love Story") {
            tips = (
             <div className="space-y-2 text-sm">
                <p>This edition is a chance to reflect, celebrate, and share the journey.</p>
                <p>These stories tend to resonate most when they feel vivid and grounded in real-life moments. Don't just say, "We went to Italy"—tell us about the sound of street music, the taste of that perfect pasta, or how the sunlight hit their face on the train.</p>
                <p>Think about the five senses: what did it look like, smell like, feel like to be there together? That's what makes these cards come alive.</p>
             </div>
           );
       } else if (themeName === "A Year of Gratitude") {
            tips = (
             <div className="space-y-2 text-sm">
                <p>Focus on specific moments, people, or experiences you're thankful for each month.</p>
                <p>Small details make gratitude feel more genuine. Instead of just "Thanks for being there," try "I appreciated when you..."</p>
                <p>Consider different facets of life: relationships, nature, personal growth, simple pleasures.</p>
             </div>
           );
       }
       // Add more 'else if' blocks for other known custom themes here...
       else {
            tips = <p>Describe the key moments and feelings associated with <strong>{themeName}</strong>. Use details to bring your memories to life.</p>; // Generic fallback
       }

   }
   // Try parsing format: "Category – Subcategory – Location" (Signature style)
   else if (label.includes(' – ')) {
       const parts = label.split(' – ');
       const category = parts[0]?.trim();
       const subcategory = parts[1]?.trim();
       const location = parts[2]?.trim();
       themeName = label; // Use full label for signature types for now

       if (category === 'Sports' && location && subcategory) {
           themeName = `${location} ${subcategory}`;
           tips = <p>Capture the energy of the game, key plays, or the feeling of being a fan. What makes {location} {subcategory} special?</p>;
       } else if (category === 'Music' && location && subcategory) {
           themeName = `${location} ${subcategory}`;
           tips = <p>Think about the sounds, the artists, the venues, or the emotions the music evokes. What defines the {location} {subcategory} scene?</p>;
       } else if (category === 'Local History' && location) {
           themeName = `${location} Local History`;
           tips = <p>Focus on specific events, places, or people that shaped {location}. What stories does this place hold?</p>;
       }
       // Add more signature category rules if needed...
   } else {
     // Fallback if label format is unexpected
     themeName = label;
   }


  return { themeName, tips };
};

// <<< Define Inner Component for Card 4 Content >>>
const Card4Content: React.FC = () => {
  const [activeTab, setActiveTab] = useState('story');

  return (
    <div className="space-y-4 text-sm">
      <p>You'll customize three parts of each card. We'll walk you through each one:</p>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Mimic TabsList style from CustomMonthCard */}
        <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-gray-100/80 rounded-lg shadow-sm mb-4">
          <TabsTrigger 
             value="story" 
             className="text-xs sm:text-sm font-medium text-neutral-500 hover:text-neutral-700 data-[state=active]:bg-white data-[state=active]:text-neutral-800 data-[state=active]:shadow rounded-md py-1.5"
          >Story</TabsTrigger>
          <TabsTrigger 
            value="artwork" 
             className="text-xs sm:text-sm font-medium text-neutral-500 hover:text-neutral-700 data-[state=active]:bg-white data-[state=active]:text-neutral-800 data-[state=active]:shadow rounded-md py-1.5"
           >Artwork</TabsTrigger>
          <TabsTrigger 
            value="custom-notes" 
             className="text-xs sm:text-sm font-medium text-neutral-500 hover:text-neutral-700 data-[state=active]:bg-white data-[state=active]:text-neutral-800 data-[state=active]:shadow rounded-md py-1.5"
           >Custom Notes</TabsTrigger>
        </TabsList>
        
        {/* Content Areas - Use simple divs, not TabsContent for this simulation */}
        {activeTab === 'story' && (
          <div>
            <p>This is the heart of it. Each card includes a headline and a story. You can write the full text yourself, or just give us the raw details and let us shape it for you—both options are included.</p>
            <ul className="pl-0 mt-2 space-y-1"> 
              <li className="text-sm flex items-start"><span className="mr-2">✏️</span><span><strong>Exact Text?</strong> Keep the headline under 25 characters and the story under 1,700.</span></li>
              <li className="text-sm flex items-start"><span className="mr-2">🤔</span><span><strong>Want us to help?</strong> Share at least 5 bullet points. Focus on the five senses, small details, and emotional beats.</span></li>
              <li className="text-sm flex items-start"><span className="mr-2">🎤</span><span><strong>Feeling chatty?</strong> Record yourself telling the story—we'll take it from there.</span></li>
            </ul>
          </div>
        )}
        {activeTab === 'artwork' && (
          <div>
            <p>You choose what goes on the front. For each card, you can:</p>
            <ul className="pl-0 mt-2 space-y-1">
              <li className="text-sm flex items-start"><span className="mr-2">🎨</span><span>Let us create original illustrations from your story</span></li>
              <li className="text-sm flex items-start"><span className="mr-2">🖼️</span><span>Upload a photo and we'll generate artwork inspired by it</span></li>
              <li className="text-sm flex items-start"><span className="mr-2">✨</span><span>Or just use the exact photo—no edits.</span></li>
            </ul>
          </div>
        )}
        {activeTab === 'custom-notes' && (
           <div>
            <p>You can include a short note at the bottom of any month's card to mark a birthday, anniversary, or moment that matters. Cards ship near the beginning of each month, but you can also adjust the delivery date to better match your timeline.</p>
          </div>
        )}
      </Tabs>
    </div>
  );
};

// Define Card Content
const coachingCardsData: CoachingCard[] = [
  {
    id: 1,
    title: "Welcome to Your Custom Edition",
    content: (/* Static content */) => ( // Wrap static content in function for consistency
      <div className="space-y-2 text-sm">
        <p>You're building a one-of-a-kind collection—personal, meaningful, unforgettable.</p>
        <p>This process usually takes 10–30 minutes, but don't worry—you can save your progress and return anytime. We've already emailed you a magic link that picks up right where you left off.</p>
        <p>You'll be telling a story for each month of the year. Some people connect their stories to actual calendar months, others just focus on what's meaningful—it's totally up to you.</p>
        <p>Once you submit your order, our team gets to work. We'll craft a fully formatted edition based on everything you share and send you a preview within 48 hours so you can review and request edits. No extra charge—just part of the experience.</p>
      </div>
    ),
  },
  {
    id: 2,
    title: "Tips for Your Edition Type",
    content: (edition) => { // <<< Dynamic content function
        const { themeName, tips } = getEditionDetailsAndTips(edition);
        return (
            <div className="space-y-2 text-sm">
                <p>Your edition is <strong>{themeName}</strong>—a chance to reflect, celebrate, and share the journey.</p>
                {/* Render the dynamic tips */}
                {tips}
            </div>
        );
    },
  },
  {
    id: 3,
    title: "How to Jog Your Memory",
    content: (/* Static content */) => (
      <div className="space-y-2 text-sm">
         <p>Need a spark? We've got you.</p>
         <p>Check your photo library—especially the "People" section or yearly memory recaps. Scroll through your calendar and social media. Even old messages, playlists, or receipts can bring a moment rushing back.</p>
         <p>You don't have to have the whole story figured out before you begin—just find one thread and start pulling. We'll help you turn it into something special.</p>
      </div>
     ),
  },
  {
    id: 4,
    title: "What You'll Customize for Each Month",
    content: () => <Card4Content /> 
  },
];

interface CoachingCarouselProps {
  isOpen: boolean;
  onClose: () => void;
  // onReopen: () => void; // Needed if button is external
}

// Animation variants
const variants = {
  enter: {
    opacity: 0,
    y: 10,
  },
  center: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -10,
  },
};

const CoachingCarousel: React.FC<CoachingCarouselProps> = ({ isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // <<< Get selectedEdition from store >>>
  const selectedEdition = useSessionStore(state => state.session.selectedEdition);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % coachingCardsData.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + coachingCardsData.length) % coachingCardsData.length);
  };

  // Reset index if reopened (optional)
  // useEffect(() => {
  //   if (isOpen) setCurrentIndex(0);
  // }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const currentCard = coachingCardsData[currentIndex];
  // <<< Evaluate content function if it exists >>>
  const cardContent = typeof currentCard.content === 'function'
    ? currentCard.content(selectedEdition)
    : currentCard.content;

  return (
    // Outer container is just for positioning and max-width
    <div className="relative p-4 rounded-lg mb-6 max-w-3xl mx-auto">
      {/* Card for border/background */}
      <Card className="overflow-hidden border border-stone-200">
        {/* Remove layout animation from this wrapper */}
        <motion.div> 
            {/* Apply min-height here for consistent card height */}
            <CardContent className="p-4 md:p-6 bg-stone-50 min-h-[350px]">
              <AnimatePresence mode="wait" initial={false}> 
                <motion.div
                  key={currentIndex} // Key change triggers animation
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <h4 className="font-semibold text-lg mb-3 text-legacy-green">{currentCard.title}</h4>
                  {cardContent}
                </motion.div>
              </AnimatePresence>
            </CardContent>
        </motion.div>
      </Card>

      {/* Close Button (remains top-right) */}
      <div className="absolute top-6 right-6 z-10">
        <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:text-gray-700 hover:bg-gray-100/50 rounded-full">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* <<< NEW Bottom Navigation Container >>> */}
      <div className="flex items-center justify-between pt-3">
          {/* Prev Arrow */}
          <Button variant="outline" size="icon" onClick={handlePrev} className="bg-white/80 hover:bg-white shadow rounded-full">
             <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex space-x-1.5">
             {coachingCardsData.map((_, index) => (
               <button
                 key={index}
                 onClick={() => setCurrentIndex(index)}
                 className={cn(
                   "h-1.5 w-1.5 rounded-full transition-all",
                   index === currentIndex ? "bg-legacy-green scale-125" : "bg-legacy-green/30 hover:bg-legacy-green/50"
                 )}
                 aria-label={`Go to card ${index + 1}`}
               />
             ))}
           </div>

           {/* Next Arrow */}
           <Button variant="outline" size="icon" onClick={handleNext} className="bg-white/80 hover:bg-white shadow rounded-full">
             <ChevronRight className="h-5 w-5" />
           </Button>
      </div>
    </div>
  );
};

export default CoachingCarousel; 