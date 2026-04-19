'use client';

import { usePathname } from 'next/navigation';

export function HeaderSpacer() {
  const pathname = usePathname();
  
  // Don't show spacer on home page
  if (pathname === '/') {
    return null;
  }

  return (
    <div 
      className="h-16 md:h-20 lg:h-20 transition-all duration-500"
      style={{ backgroundColor: '#0c1327' }}
    />
  );
}
