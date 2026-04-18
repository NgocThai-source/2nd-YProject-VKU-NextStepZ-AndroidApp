'use client';

import { motion } from 'framer-motion';
import { Facebook, Linkedin, Instagram, MessageCircle } from 'lucide-react';

interface SocialLink {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  gradientStart: string;
  gradientEnd: string;
  color1: string;
  color2: string;
}

const socialLinks: SocialLink[] = [
  {
    name: 'Facebook',
    icon: Facebook,
    href: 'https://facebook.com/nextstepz',
    gradientStart: 'from-blue-500',
    gradientEnd: 'to-blue-600',
    color1: 'rgb(59, 130, 246)',
    color2: 'rgb(37, 99, 235)',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    href: 'https://linkedin.com/company/nextstepz',
    gradientStart: 'from-cyan-400',
    gradientEnd: 'to-blue-500',
    color1: 'rgb(34, 211, 238)',
    color2: 'rgb(59, 130, 246)',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    href: 'https://instagram.com/nextstepz',
    gradientStart: 'from-pink-500',
    gradientEnd: 'to-rose-500',
    color1: 'rgb(236, 72, 153)',
    color2: 'rgb(244, 63, 94)',
  },
  {
    name: 'Discord',
    icon: MessageCircle,
    href: 'https://discord.gg/nextstepz',
    gradientStart: 'from-purple-500',
    gradientEnd: 'to-indigo-600',
    color1: 'rgb(168, 85, 247)',
    color2: 'rgb(79, 70, 229)',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
    },
  },
};

export function SocialIcons() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex items-center gap-3"
    >
      {socialLinks.map((social) => {
        const Icon = social.icon;
        return (
          <motion.a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Truy cập ${social.name}`}
            variants={itemVariants}
            whileHover={{
              scale: 1.15,
              y: -6,
            }}
            whileTap={{
              scale: 0.92,
            }}
            transition={{
              duration: 0.25,
              type: 'spring',
              stiffness: 500,
              damping: 12,
            }}
            className="group relative"
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 rounded-full bg-linear-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"
              style={{
                backgroundImage: `linear-gradient(135deg, var(--start-color), var(--end-color))`,
                '--start-color': 'rgba(59, 130, 246, 0.3)',
                '--end-color': 'rgba(34, 211, 238, 0.3)',
              } as React.CSSProperties}
            />

            {/* Icon container */}
            <div
              className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/15 text-white/70 hover:text-white transition-all duration-300 backdrop-blur-sm overflow-hidden"
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${social.color1} 0%, ${social.color2} 100%)`,
                }}
              />
              <Icon className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110" />
            </div>

            {/* Subtle tooltip */}
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white/60 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {social.name}
            </span>
          </motion.a>
        );
      })}
    </motion.div>
  );
}
