
import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Jordan",
    relation: "Husband",
    quote: "My wife cried the first time she got a card. Then every month, she started texting her sisters about them."
  },
  {
    name: "Alexis",
    relation: "Daughter",
    quote: "I wanted to give my mom something different for her 60th. She calls me every time a new card arrives."
  },
  {
    name: "Terrence",
    relation: "Friend",
    quote: "It's perfect for my best friend who moved across the country. It keeps our memories alive."
  },
  {
    name: "Mariana",
    relation: "Sister",
    quote: "I never knew what to get my brother. This was the first gift I've given that he actually talks about months later."
  }
];

const TestimonialsSection = () => {
  return (
    <section className="w-full py-20 bg-legacy-cream/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair text-legacy-dark mb-6">
            What Our Gifters Are Saying
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <p className="text-lg italic mb-4 text-legacy-dark/80">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div className="h-10 w-10 bg-legacy-green/20 rounded-full flex items-center justify-center text-legacy-green font-bold mr-3">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-legacy-dark/60">{testimonial.relation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-12">
          <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
            <div className="flex text-legacy-gold mr-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span className="text-sm font-medium">4.9 Average from 800+ Reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
