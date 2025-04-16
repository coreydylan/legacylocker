import { useState, useEffect } from 'react';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Ensure window is defined (for SSR compatibility, though likely not needed here)
    if (typeof window === 'undefined') {
      return;
    }

    const media = window.matchMedia(query);
    // Update state initially and whenever the media query match status changes
    const updateMatch = () => setMatches(media.matches);

    updateMatch(); // Initial check

    // Add listener for changes
    // Using addEventListener for modern browsers
    try {
      media.addEventListener('change', updateMatch);
    } catch (e1) {
      // Fallback for older browsers
      try {
        media.addListener(updateMatch);
      } catch (e2) {
        console.error("Error adding media query listener:", e2);
      }
    }

    // Cleanup function to remove the listener
    return () => {
      try {
        media.removeEventListener('change', updateMatch);
      } catch (e1) {
        // Fallback for older browsers
        try {
          media.removeListener(updateMatch);
        } catch (e2) {
          console.error("Error removing media query listener:", e2);
        }
      }
    };
  }, [query]); // Re-run effect if the query string changes

  return matches;
}

export default useMediaQuery; 