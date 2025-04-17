import React, { useEffect } from 'react';
import { useModalStore } from '@/lib/modalStore';
import useMediaQuery from '@/hooks/useMediaQuery';
import SaveAndCloseButton from './onboarding/SaveAndCloseButton';

const OnboardingDesktopSaveButton: React.FC = () => {
  const { isOnboardingOpen, closeOnboarding } = useModalStore();
  // Consider sm breakpoint (640px) for desktop
  const isDesktop = useMediaQuery('(min-width: 640px)');

  useEffect(() => {
    console.log('[OnboardingDesktopSaveButton] isOnboardingOpen:', isOnboardingOpen, 'isDesktop:', isDesktop);
  }, [isOnboardingOpen, isDesktop]);

  if (!isOnboardingOpen || !isDesktop) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <SaveAndCloseButton onClose={closeOnboarding} />
    </div>
  );
};

export default OnboardingDesktopSaveButton; 