
import React from 'react';

const PhilosophySection = () => {
  return (
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-2 h-1 w-24 bg-legacy-gold mx-auto"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 font-playfair text-legacy-dark">
            Life is made of stories.
          </h2>
          
          <p className="text-lg text-center leading-relaxed">
            Legacy Locker takes the stories that matter most—to your people, your places, your past—and transforms them into collectible works of art. Each card is designed to land in their mailbox on the days that matter most: birthdays, anniversaries, milestones, holidays. Whether gifting a parent, partner, friend, or team, every delivery becomes a reason to feel seen.
          </p>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card mockup examples */}
            {[1, 2, 3].map((item) => (
              <div 
                key={item} 
                className="bg-legacy-cream p-5 rounded-lg card-shadow transform hover:-translate-y-1 transition-transform duration-300 flex flex-col items-center"
              >
                <div className="w-full h-48 bg-white rounded border border-gray-200 mb-4 overflow-hidden">
                  <div className="h-full w-full bg-legacy-green/10 flex items-center justify-center">
                    <span className="text-legacy-green font-playfair text-xl">Story Card</span>
                  </div>
                </div>
                <p className="text-center text-sm text-legacy-dark/70 italic">
                  "Each card tells a chapter of your story..."
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
