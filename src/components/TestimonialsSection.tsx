import React, { useEffect, useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

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
  },
  {
    name: "Sarah",
    relation: "Mother",
    quote: "I gave this to my daughter who just moved to college. She says it's the highlight of her month when a new card arrives."
  },
  {
    name: "Michael",
    relation: "Son",
    quote: "My dad's face lights up every time he gets a new card. It's like I'm there with him, sharing our favorite memories."
  },
  {
    name: "Emma",
    relation: "Granddaughter",
    quote: "My grandma lives alone and these cards bring her so much joy. She keeps them all on her coffee table."
  },
  {
    name: "David",
    relation: "Uncle",
    quote: "I gave this to my niece for her graduation. She says it's the most thoughtful gift she's ever received."
  }
];

const TestimonialsSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-legacy-dark mb-6 font-manrope lowercase">
            what they'll be saying...
            <span className="relative inline-block ml-2">
              <span className="relative z-10 bg-[#fff4d6] px-2">magical moments</span>
            </span>
          </h2>
        </div>
        
        <div className="w-full max-w-[1200px] mx-auto relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-4 basis-full md:basis-1/3">
                  <div className="bg-white p-6 rounded-lg shadow-md h-full">
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
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-12 hidden md:flex" />
            <CarouselNext className="-right-12 hidden md:flex" />
            
            {/* Mobile swipe indicators */}
            <div className="flex items-center justify-between absolute bottom-4 left-1/2 -translate-x-1/2 w-24 md:hidden">
              <ChevronLeft className="h-4 w-4 text-legacy-dark/40 animate-pulse" />
              <ChevronRight className="h-4 w-4 text-legacy-dark/40 animate-pulse" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
