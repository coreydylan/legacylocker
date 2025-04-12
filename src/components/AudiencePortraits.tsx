
import React from 'react';

const personas = [
  {
    title: "The Thoughtful Partner",
    quote: "I wanted something more meaningful than jewelry this year. Legacy Locker helped me tell our story.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces"
  },
  {
    title: "The Legacy Parent",
    quote: "I used it to share stories about our family history with my daughter. It turned into a ritual.",
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=faces"
  },
  {
    title: "The Impossible-to-Shop-For Person",
    quote: "They already have everything. But not this.",
    image: "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=150&h=150&fit=crop&crop=faces"
  }
];

const AudiencePortraits = () => {
  return (
    <section className="w-full py-20 bg-legacy-cream/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair text-legacy-dark mb-6">
            Made for the Meaning-Makers
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {personas.map((persona, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-lg shadow-md"
            >
              <div className="flex flex-col items-center">
                <img 
                  src={persona.image} 
                  alt={persona.title} 
                  className="w-20 h-20 rounded-full object-cover border-2 border-legacy-gold mb-4"
                />
                <h3 className="text-xl font-bold mb-2 font-playfair">{persona.title}</h3>
                <p className="text-center italic text-legacy-dark/80">"{persona.quote}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudiencePortraits;
