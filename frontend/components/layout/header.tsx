'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

import { AuthButton } from './header/auth-button';
import { LangDropdown } from './header/lang-dropdown';
import { MobileMenu } from './header/mobile-menu';
import { NavMenu } from './header/nav-menu';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Optimized scroll listener with requestAnimationFrame throttling
  useEffect(() => {
    let scrollRequest: number | null = null;

    const handleScroll = () => {
      if (scrollRequest !== null) {
        cancelAnimationFrame(scrollRequest);
      }

      scrollRequest = requestAnimationFrame(() => {
        const isScrolled = window.scrollY > 25;
        setScrolled(isScrolled);
      });
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollRequest !== null) {
        cancelAnimationFrame(scrollRequest);
      }
    };
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'h-16 md:h-14 bg-linear-to-br from-slate-950 via-slate-900/95 to-blue-950/30 backdrop-blur-lg border-b border-cyan-400/15 shadow-lg shadow-black/20'
          : 'h-20 md:h-20 bg-linear-to-br from-slate-950 via-slate-900/90 to-blue-950/40 backdrop-blur-sm border-b border-cyan-400/15 shadow-md shadow-black/10'
      }`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      <nav className={`h-full flex items-center transition-all duration-500 ${
        scrolled
          ? 'px-4 md:px-8 justify-start max-w-7xl mx-auto w-full gap-6 md:-translate-x-30'
          : 'px-4 md:px-12 justify-start gap-8 w-full'
      }`}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      >
        {/* Logo Section */}
        <Link
          href="/"
          className="shrink-0 flex items-center overflow-hidden transition-all duration-500"
          onClick={closeMobileMenu}
          style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          <div className="relative h-full flex items-center">
            {/* Logo Full (Normal) */}
            <div
              className={`transition-all duration-500 ${
                scrolled ? 'opacity-0 scale-50 w-0 pointer-events-none' : 'opacity-100 scale-100 w-auto'
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              <Image
                src="/images/logofull1-transprent.png"
                alt="NextStepZ Logo"
                width={200}
                height={64}
                sizes="(max-width: 768px) 120px, 200px"
                className="h-12 md:h-16 w-auto object-contain"
                priority
                quality={100}
                unoptimized
              />
            </div>

            {/* Logo Text (Scrolled) */}
            <div
              className={`transition-all duration-500 ${
                scrolled ? 'opacity-100 scale-100 w-auto' : 'opacity-0 scale-50 w-0 pointer-events-none'
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              <Image
                src="/images/logo-icon.png"
                alt="NextStepZ Logo Text"
                width={120}
                height={40}
                sizes="(max-width: 768px) 80px, 120px"
                className="h-8 md:h-10 w-auto object-contain"
                quality={100}
                unoptimized
              />
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Menu */}
        <div className={`hidden md:flex transition-all duration-500 ${scrolled ? 'flex-1 justify-start px-4' : 'flex-1'}`}
          style={{
            transform: scrolled ? 'translateX(-10px)' : 'translateX(0)',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <NavMenu scrolled={scrolled} />
        </div>

        {/* Right Actions */}
        <div className={`hidden md:flex items-center gap-4 transition-all duration-500 ${scrolled ? 'ml-auto' : 'ml-auto'}`}
          style={{
            transform: scrolled ? 'translateX(120px)' : 'translateX(0)',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <LangDropdown scrolled={scrolled} />
          <AuthButton scrolled={scrolled} />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors duration-200 text-white ml-auto"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
      />
    </header>
  );
}
