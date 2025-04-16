import React from 'react';
import { Calendar, Mail, Heart } from 'lucide-react';

const benefits = [
  {
    icon: <Calendar className="h-12 w-12 text-legacy-gold" />,
    title: "thoughtfulness on autopilot",
    description: "You'll spend a few minutes now to give them something unforgettable all year long. Each card is automatically timed to arrive when it matters most — birthdays, anniversaries, or just because.",
    bullets: [
      "Give a gift with real meaning (and no last-minute stress)",
      "Celebrate important dates without needing reminders",
      "Show up month after month with zero extra effort",
      "THE gift for the impossible-to-shop-for"
    ]
  },
  {
    icon: <Mail className="h-12 w-12 text-legacy-gold" />,
    title: "mail that matters",
    description: "Every month, they'll open a beautifully crafted card that sparks joy — and reflection. Whether it's stories about their favorite team, their neighborhood's roots, or personal memories, it feels intimate, surprising, and worth keeping.",
    bullets: [
      "A ritual that makes them feel seen",
      "Discover new stories or revisit old ones",
      "Artwork and writing they'll want to show off",
      "Actual joy in the mailbox (not junk)"
    ]
  },
  {
    icon: <Heart className="h-12 w-12 text-legacy-gold" />,
    title: "stories create connection",
    description: "Legacy Locker builds a shared rhythm — a quiet \"I'm thinking of you\" that shows up again and again. Each card becomes a reason to reach out, reminisce, or just feel close.",
    bullets: [
      "Sparks meaningful conversations",
      "Keeps you on each other's mind",
      "Builds something bigger than the gift itself"
    ]
  }
];

const BenefitsSection = () => {
  return (
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair text-legacy-dark mb-6">
            making magic by mail
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="text-left p-8 border border-legacy-cream rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="inline-flex items-center justify-center rounded-full bg-legacy-green/5 p-6 mb-6">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-normal mb-4 font-playfair text-legacy-green">{benefit.title}</h3>
              <p className="text-legacy-dark/80 mb-6">{benefit.description}</p>
              <ul className="space-y-3">
                {benefit.bullets.map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className="flex items-start">
                    <span className="text-legacy-gold mr-2">•</span>
                    <span className="text-legacy-dark/80">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
