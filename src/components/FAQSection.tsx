
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
    answer: "We show you a sneak peek during setup, and you can always pause or edit before each card ships."
  },
  {
    question: "What if I don't have 12 stories to tell?",
    answer: "You can start with fewer and add more later — or let us fill in gaps with our pre-written cards."
  },
  {
    question: "Can this be a corporate or team gift?",
    answer: "Absolutely. We offer branded experiences for client, employee, and team gifting. Contact us for details."
  },
  {
    question: "Will the recipient know who it's from?",
    answer: "Yes, we include a custom message from you in the welcome kit and each card (if you'd like)."
  },
  {
    question: "What if I need to cancel or delay?",
    answer: "You're always in control. Just log in to adjust your schedule or pause shipments."
  }
];

const FAQSection = () => {
  return (
    <section className="w-full py-20 bg-legacy-cream/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair text-legacy-dark mb-6">
            Frequently Asked Questions
          </h2>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium text-lg py-4">
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
