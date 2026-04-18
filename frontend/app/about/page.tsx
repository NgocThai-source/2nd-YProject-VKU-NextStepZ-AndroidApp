'use client';

import {
  AboutHeroSection,
  OurStorySection,
  VisionMissionSection,
  FoundersSection,
} from '@/components/about';

export default function AboutPage() {
  return (
    <main className="w-full overflow-x-hidden">
      <AboutHeroSection />
      <OurStorySection />
      <VisionMissionSection />
      <FoundersSection />
    </main>
  );
}
