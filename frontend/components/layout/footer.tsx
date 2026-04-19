'use client';

import { BrandSection } from './footer/brand-section';
import { FooterLinks } from './footer/footer-links';
import { Newsletter } from './footer/newsletter';
import { FooterCopyright } from './footer/footer-copyright';

export default function Footer() {
  return (
    <footer className="relative w-full bg-linear-to-b from-slate-950 to-slate-900 border-t border-white/5 overflow-hidden">
      {/* Ambient background effect */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {/* Gradient orbs for premium feel */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/2 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-4 md:py-6 grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-2">
          {/* Brand Section - 1 column */}
          <div className="md:col-span-1">
            <BrandSection />
          </div>

          {/* Links + Newsletter - 3 columns */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-2 pt-3 md:pt-20 ml-4 md:ml-8">
            {/* Navigation Links - 2 columns on desktop */}
            <div className="md:col-span-2">
              <FooterLinks />
            </div>

            {/* Newsletter - 1 column */}
            <div className="md:col-span-1">
              <Newsletter />
            </div>
          </div>
        </div>

        {/* Footer Copyright */}
        <FooterCopyright />

        {/* Bottom padding */}
        <div className="h-8" />
      </div>
    </footer>
  );
}
