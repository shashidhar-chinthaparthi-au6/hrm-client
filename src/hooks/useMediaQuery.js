import { useState, useEffect } from 'react';

const useMediaQuery = (query) => {
  // Initialize with current match status
  const getMatches = () => {
    // Prevent SSR issues
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    // Handle change event
    const handleChange = () => {
      setMatches(matchMedia.matches);
    };

    // Set up listener using addEventListener (more modern approach)
    matchMedia.addEventListener('change', handleChange);

    // Trigger initial check
    handleChange();

    // Clean up
    return () => {
      matchMedia.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};

// Common media query presets
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const useIsDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)');
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

export default useMediaQuery;