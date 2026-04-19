'use client';

import { useEffect, useState } from 'react';

/**
 * Mobile viewport helper for responsive breakpoints
 */
export function useMobileViewport() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    // Initial check
    if (typeof window !== 'undefined') {
      checkViewport();
    }

    window.addEventListener('resize', checkViewport);

    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  return { isMobile, isTablet };
}
