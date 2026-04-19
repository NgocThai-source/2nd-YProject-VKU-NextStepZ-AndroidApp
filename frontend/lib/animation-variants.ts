/**
 * Animation Variants & Utilities for Home Page Components
 * Provide reusable Framer Motion configurations
 */

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export const scaleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6 },
  },
};

export const slideInVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6 },
  },
};

export const floatingVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1 },
  },
  animate: {
    y: [0, 20, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
    },
  },
};

export const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
  },
};

export const hoveredScaleVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
};

// Batch animation delays
export const getStaggerDelay = (index: number, baseDelay: number = 0.1) => {
  return index * baseDelay;
};

// Hover shadow effect for cards
export const cardHoverStyle = {
  boxShadow: '0 0 30px rgba(34, 211, 238, 0.2)',
};

// Glow effect for buttons
export const glowButtonStyle = {
  boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
};
