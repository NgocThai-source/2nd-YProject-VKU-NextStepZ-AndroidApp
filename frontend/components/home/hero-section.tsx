'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Star, Zap, Users, Briefcase } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Animated counter component with intersection observer
const CountUpNumber = ({ value, suffix = '', duration = 2 }: { value: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const targetValue = value;
    const increment = targetValue / (duration * 60);
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        setCount(targetValue);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [isVisible, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

// Floating particles for premium effect - Client-side only to prevent hydration mismatch
const FloatingParticles = () => {
  const [mounted, setMounted] = useState(false);

  // Only render on client to avoid hydration mismatch with random values
  useEffect(() => {
    setMounted(true);
  }, []);

  // Precompute all random values in useMemo with seeded-like approach
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: (i * 17 + 23) % 100, // Deterministic spread
      delay: (i * 0.25) % 5,
      duration: 8 + (i % 5),
      size: 2 + (i % 4),
      opacity1: 0.4 + ((i * 7) % 40) / 100,
      opacity2: 0.4 + ((i * 11) % 40) / 100,
      xOffset: ((i * 13) % 100) - 50,
    })), []
  );

  if (!mounted) return null;

  return (
    <div className="particles-container">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.left}%`,
            bottom: '-10px',
            width: particle.size,
            height: particle.size,
            background: `linear-gradient(135deg, rgba(34, 211, 238, ${particle.opacity1}), rgba(59, 130, 246, ${particle.opacity2}))`,
          }}
          animate={{
            y: [0, -800],
            x: [0, particle.xOffset],
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 0.8],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

export default function HeroSection() {
  const handleLearnMore = () => {
    const nextSection = document.getElementById('mission-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };



  const floatingFeatures = [
    { label: 'Job Map - Bản đồ việc làm', delay: 0, position: { top: '15%', left: '5%' } },
    { label: 'AI Matching - Gợi ý thông minh', delay: 0.4, position: { top: '45%', right: '5%' } },
    { label: 'Cộng đồng NextStepZ', delay: 0.8, position: { top: '75%', left: '10%' } },
  ];

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 md:px-8 py-20 md:py-28">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, 80, 0],
            y: [0, 60, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-60 -left-40 w-[600px] h-[600px] rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{
            x: [0, -60, 0],
            y: [0, -80, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 60%)',
            filter: 'blur(50px)',
          }}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -50, 100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          animate={{
            backgroundPosition: ['0px 0px', '100px 100px'],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundImage: 'linear-gradient(90deg, #22d3ee 1px, transparent 1px), linear-gradient(#22d3ee 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <FloatingParticles />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="space-y-8" variants={itemVariants}>
            <motion.div
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full premium-badge backdrop-blur-xl w-fit"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </motion.div>
              <span
                className="text-sm font-semibold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent"
                style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
              >
                Tương lai bắt đầu từ đây
              </span>
              <motion.div
                className="w-2 h-2 rounded-full bg-cyan-400"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <motion.div className="space-y-4" variants={itemVariants}>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                <Image
                  src="/images/logofull1-transprent.png"
                  alt="NextStepZ Logo"
                  width={420}
                  height={140}
                  sizes="(max-width: 768px) 320px, 420px"
                  className="w-80 h-auto md:w-[420px] drop-shadow-2xl"
                  priority
                />
                <div
                  className="absolute inset-0 -z-10 blur-3xl opacity-30"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.5), rgba(59, 130, 246, 0.5))',
                  }}
                />
              </motion.div>
              <h2
                className="text-xl md:text-3xl font-bold gradient-text-premium ml-1"
                style={{ fontFamily: "'Poppins Medium Italic', sans-serif" }}
              >
                Your First Step to the Future
              </h2>
            </motion.div>
            <motion.p
              className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl"
              style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              variants={itemVariants}
            >
              Kết nối <span className="text-cyan-300 font-semibold">sinh viên</span>, <span className="text-cyan-300 font-semibold">nhà tuyển dụng</span> và <span className="text-cyan-300 font-semibold">cựu sinh viên</span> trong cùng một hệ sinh thái công nghệ hiện đại.
              <br className="hidden md:block" />
              Nơi bạn tìm thấy cơ hội, rèn luyện kỹ năng và kiến tạo tương lai sự nghiệp.
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row gap-4 pt-2" variants={itemVariants}>
              <Link href="/auth">
                <motion.button
                  className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold flex items-center justify-center gap-3 overflow-hidden"
                  style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 blur-xl" />
                  <span className="relative z-10 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Khám Phá Ngay
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </Link>

              <motion.button
                className="group px-8 py-4 rounded-xl glass-button text-cyan-300 font-semibold flex items-center justify-center gap-2"
                style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLearnMore}
              >
                Tìm Hiểu Thêm
                <motion.div
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </motion.div>
              </motion.button>
            </motion.div>


          </motion.div>
          <motion.div
            className="relative h-[500px] md:h-[600px] hidden lg:block"
            variants={itemVariants}
          >
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                className="absolute w-[450px] h-[450px] rounded-full border border-cyan-500/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 glow-cyan" />
              </motion.div>
              <motion.div
                className="absolute w-[350px] h-[350px] rounded-full border border-purple-500/20"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-purple-400 glow-purple" />
              </motion.div>
              <motion.div
                className="absolute w-[250px] h-[250px] rounded-full border border-blue-500/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-400 glow-blue" />
              </motion.div>
              <motion.div
                className="absolute w-40 h-40 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 70%)',
                  filter: 'blur(20px)',
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
            {floatingFeatures.map((feature, idx) => (
              <motion.div
                key={idx}
                className="absolute glass-card-strong px-5 py-3 rounded-xl"
                style={feature.position}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: [0, -15, 0],
                }}
                transition={{
                  opacity: { duration: 0.5, delay: 1 + feature.delay },
                  y: { duration: 4, repeat: Infinity, delay: feature.delay },
                }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                  >
                    <Star className="w-4 h-4 text-cyan-400" />
                  </motion.div>
                  <span
                    className="text-sm font-medium text-cyan-300"
                    style={{ fontFamily: "'Poppins SemiBold', sans-serif" }}
                  >
                    {feature.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-none"
        animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-gray-400" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
            Scroll để khám phá
          </span>
          <div className="w-6 h-10 rounded-full border-2 border-cyan-400/50 flex justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-cyan-400"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
