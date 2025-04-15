import React, { useState, useEffect } from 'react';
import OnboardingStepperDesktop from './OnboardingStepperDesktop';
import OnboardingStepperMobile from './OnboardingStepperMobile';

// Basic hook to detect screen size (can be replaced with a more robust library)
const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        // Update state on initial check
        setMatches(mediaQuery.matches);
        // Listener function to update state on change
        const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
        // Add listener
        mediaQuery.addEventListener('change', listener);
        // Cleanup listener on component unmount
        return () => mediaQuery.removeEventListener('change', listener);
    }, [query]);

    return matches;
};

const OnboardingStepper: React.FC = () => {
    // Use sm breakpoint (640px) as the threshold
    const isDesktop = useMediaQuery('(min-width: 640px)');

    return isDesktop ? <OnboardingStepperDesktop /> : <OnboardingStepperMobile />;
};

export default OnboardingStepper; 