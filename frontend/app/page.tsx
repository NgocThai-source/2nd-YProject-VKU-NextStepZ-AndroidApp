'use client';

import HeroSection from '@/components/home/hero-section';
import MissionSection from '@/components/home/mission-section';
import ConnectionHubSection from '@/components/home/connection-hub-section';
import FeaturesSection from '@/components/home/features-section';
import VisionSection from '@/components/home/vision-section';
import CTASection from '@/components/home/cta-section';

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden">
      <HeroSection />
      <MissionSection />
      <ConnectionHubSection />
      <FeaturesSection />
      <VisionSection />
      <CTASection />
    </main>
  );
}