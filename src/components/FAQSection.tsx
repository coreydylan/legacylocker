import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Can I preview the cards before sending?",
    answer: "Custom Editions come with full digital proofs within 48 hours of submission so you can review everything before it's sent. Signature Editions are designed to surprise and delight the recipient — part of the magic is not knowing exactly what's coming, just that it's meaningful, beautiful, and delivered right on theme and on time."
  },
  {
    question: "What if I don't have 12 stories to tell?",
    answer: "You don't need to. For Signature Editions, we've already curated the stories for you. For Custom, you can give us bullet points—or just a general vibe—and we'll help shape the rest."
  },
  {
    question: "Will the recipient know who it's from?",
    answer: "Yes, and they'll never forget it. We include a welcome card with your name, custom message, and the overall theme you've chosen."
  },
  {
    question: "What happens if the recipient moves during the year?",
    answer: "No problem. You or they can update the shipping address any time, and we'll make sure future cards follow them. We'll include information on their welcome card about how to update their address if they choose."
  },
  {
    question: "Can I add a personal note to a specific card?",
    answer: "Absolutely. During setup, you'll have the option to add milestone messages—like for a birthday or anniversary. These appear subtly at the bottom of the card."
  },
  {
    question: "Is this a subscription? Will I get charged again?",
    answer: "Nope. Legacy Locker is a one-time purchase. You'll have the option to renew or expand later, but only if you choose to."
  },
  {
    question: "Can I send one story series to multiple people?",
    answer: "Yes! You can send a Signature or Custom Edition and send it to a list—perfect for teams, extended families, or friend groups."
  },
  {
    question: "Do you offer corporate or bulk gifting options?",
    answer: "We do. Legacy Locker makes an incredible client or team gift. Reach out and we'll tailor something special."
  },
  {
    question: "I want to tell a meaningful story, but I'm not a writer. Help?",
    answer: "We got you. Use the Concierge Edition and we'll pair you with a writer—or just choose the Custom Edition and send us notes. We'll handle the magic."
  },
  {
    question: "How are the cards shipped? Will they get damaged?",
    answer: "Each card is mailed in a rigid envelope to keep it pristine, with a personalized outer sleeve that makes it feel like a little gift."
  },
  {
    question: "Can I send Legacy Locker internationally?",
    answer: "Currently we only ship within the U.S., but international is on our roadmap. Sign up for updates if you're outside the country."
  },
  {
    question: "Can I include photos in my story?",
    answer: "Yes—especially in the Custom Edition. You can upload photos directly, and we'll either use them as-is or turn them into beautiful illustrations."
  },
  {
    question: "What if I'm not happy with the result?",
    answer: "If something's not right, we'll fix it. We believe in the magic of this experience—and we stand behind every story we help tell."
  },
  {
    question: "Is this a good gift if I'm running out of time?",
    answer: "It's actually perfect. The setup takes just a few minutes, and we'll send a welcome message immediately—even if the first card ships later."
  },
  {
    question: "Who creates the illustrations on the cards?",
    answer: "Every card features original illustrations designed just for Legacy Locker. Some are hand-drawn by our in-house artists, others are generated from custom prompts crafted to match your story's tone and details. Either way, every image is one-of-a-kind and created with care."
  }
];

const FAQSection = () => {
  return (
    <section className="w-full py-20 bg-legacy-cream/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-pangaia text-legacy-dark mb-6">
            FAQ
          </h2>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-bold font-jakarta text-lg py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-legacy-dark/80 py-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
