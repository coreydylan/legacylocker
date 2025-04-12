
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import BenefitsSection from '@/components/BenefitsSection';
import AudiencePortraits from '@/components/AudiencePortraits';
import FeaturesSection from '@/components/FeaturesSection';
import StorySeriesSelector from '@/components/StorySeriesSelector';
import TestimonialsSection from '@/components/TestimonialsSection';
import PricingSection from '@/components/PricingSection';
import FAQSection from '@/components/FAQSection';
import ClosingCTASection from '@/components/ClosingCTASection';
import Footer from '@/components/Footer';
import { getCurrentSession, hasActiveSession } from '@/services/sessionService';
import SessionPill from '@/components/onboarding/SessionPill';
import OnboardingModal from '@/components/OnboardingModal';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [showSessionPill, setShowSessionPill] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [resumeToken, setResumeToken] = useState<string | undefined>(undefined);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if there's a resume token in the URL
  useEffect(() => {
    const checkResumeToken = async () => {
      // Check if URL has resume token format: /resume-order/:token
      const match = location.pathname.match(/\/resume-order\/([^\/]+)/);
      if (match && match[1]) {
        const token = match[1];
        setResumeToken(token);
        setResumeModalOpen(true);
        
        // Clean up the URL after processing
        navigate('/', { replace: true });
      }
    };
    
    checkResumeToken();
  }, [location.pathname, navigate]);

  // Check for existing session to show the session pill
  useEffect(() => {
    const checkForSession = () => {
      const hasSession = hasActiveSession();
      setShowSessionPill(hasSession);
    };
    
    checkForSession();
    
    // Check again when the window gains focus
    const handleFocus = () => {
      checkForSession();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Handle continue from session pill
  const handleContinueSession = () => {
    setShowSessionPill(false);
    setResumeModalOpen(true);
  };

  // Handle abandon session
  const handleAbandonSession = () => {
    // SessionPill component will handle clearing the session
    setShowSessionPill(false);
  };

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
        <PricingSection />
        <FAQSection />
        <ClosingCTASection />
        
        {/* Only show session pill if there's an actual active session */}
        {showSessionPill && (
          <SessionPill
            formData={getCurrentSession().formData!}
            onContinue={handleContinueSession}
            onAbandon={handleAbandonSession}
            isOpen={showSessionPill}
          />
        )}
        
        {/* Modal for resuming a session */}
        <OnboardingModal
          isOpen={resumeModalOpen}
          onClose={() => setResumeModalOpen(false)}
          selectedSeries={getCurrentSession().formData?.selectedSeries || null}
          resumeToken={resumeToken}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
