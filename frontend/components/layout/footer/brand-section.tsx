'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { SocialIcons } from './social-icons';
import { BRAND_INFO, ANIMATION_TIMINGS } from './footer.config';

export function BrandSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: ANIMATION_TIMINGS.delay.stagger,
        delayChildren: 0,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: ANIMATION_TIMINGS.medium,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="space-y-2"
    >
      {/* Logo */}
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        className="inline-block group cursor-pointer"
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Image
            src={BRAND_INFO.logo}
            alt={BRAND_INFO.name}
            width={200}
            height={80}
            className="h-36 w-auto object-contain relative z-10 transition-all duration-300"
            quality={100}
            unoptimized
            priority
          />
        </div>
      </motion.div>

      {/* Slogan & Description */}
      <motion.div variants={itemVariants} className="space-y-3">
        <p className="text-cyan-400 font-semibold text-sm tracking-widest uppercase" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
          {BRAND_INFO.tagline}
        </p>
        <p className="text-white/70 text-sm leading-relaxed max-w-xs font-light" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
          {BRAND_INFO.description}
        </p>
      </motion.div>

      {/* Social Icons */}
      <motion.div variants={itemVariants}>
        <SocialIcons />
      </motion.div>
    </motion.div>
  );
}
