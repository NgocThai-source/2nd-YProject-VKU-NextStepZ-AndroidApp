'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FOOTER_LINK_GROUPS, ANIMATION_TIMINGS } from './footer.config';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: ANIMATION_TIMINGS.delay.stagger,
      delayChildren: ANIMATION_TIMINGS.delay.initial,
    },
  },
};

const groupVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_TIMINGS.normal,
    },
  },
};

const linkVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION_TIMINGS.short,
    },
  },
};

export function FooterLinks() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12"
    >
      {FOOTER_LINK_GROUPS.map((group) => (
        <motion.div key={group.title} variants={groupVariants} className="space-y-5">
          {/* Section Title */}
          <h4 className="text-base font-semibold text-white tracking-tight" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
            {group.title}
          </h4>

          {/* Links */}
          <ul className="space-y-3">
            {group.links.map((link) => (
              <motion.li
                key={link.href}
                variants={linkVariants}
                whileHover={{ x: 4 }}
              >
                <Link
                  href={link.href}
                  className="group text-sm text-white/70 hover:text-white transition-colors duration-300 flex items-center gap-2 relative w-fit"
                  style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                >
                  {/* Animated underline */}
                  <span className="relative inline-block">
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300 ease-out" />
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      ))}
    </motion.div>
  );
}
