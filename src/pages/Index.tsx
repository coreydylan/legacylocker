import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import BenefitsSection from '@/components/BenefitsSection';
import AudiencePortraits from '@/components/AudiencePortraits';
import FeaturesSection from '@/components/FeaturesSection';
import StorySeriesSelector from '@/components/StorySeriesSelector';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import ClosingCTASection from '@/components/ClosingCTASection';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">
        <HeroSection />
        <BenefitsSection />
        <AudiencePortraits />
        <FeaturesSection />
        <StorySeriesSelector />
        <TestimonialsSection />
        <FAQSection />
        <ClosingCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
