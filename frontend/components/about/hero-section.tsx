'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, Users, Briefcase } from 'lucide-react';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
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

export default function AboutHeroSection() {
  const scrollToSection = () => {
    const element = document.getElementById('story-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 pt-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
          animate={{
            x: [0, 80, 0],
            y: [0, 60, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1.15, 1, 1.15],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 60%)',
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 4 }}
        />

        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          animate={{ backgroundPosition: ['0px 0px', '50px 50px'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{
            backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"
            style={{
              left: `${8 + i * 8}%`,
              top: `${15 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [0, -80, 0],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 6 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 container mx-auto px-4 text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="flex justify-center mb-8" variants={itemVariants}>
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full premium-badge"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </motion.div>
            <span className="text-sm font-semibold text-cyan-300" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
              Về NextStepZ
            </span>
          </motion.div>
        </motion.div>

        <motion.h1
          className="mb-6 text-5xl md:text-7xl font-extrabold leading-tight"
          style={{ fontFamily: "'Poppins ExtraBold', sans-serif" }}
          variants={itemVariants}
        >
          <span className="gradient-text-premium">
            Nơi Bắt Đầu
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
            Hành Trình Sự Nghiệp
          </span>
        </motion.h1>

        <motion.p
          className="mb-12 max-w-3xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed"
          style={{ fontFamily: "'Poppins Regular', sans-serif" }}
          variants={itemVariants}
        >
          Chúng tôi kết nối <span className="text-cyan-300 font-semibold">sinh viên với những cơ hội phù hợp</span>,
          đồng thời <span className="text-purple-300 font-semibold">giúp bạn phát triển kỹ năng</span> để tự tin bước vào tương lai.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16"
          variants={itemVariants}
        >
          <motion.button
            onClick={scrollToSection}
            className="group relative px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg flex items-center justify-center gap-3 overflow-hidden shadow-xl"
            style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            />
            <span className="relative">Tìm Hiểu Thêm</span>
          </motion.button>

          <Link href="/">
            <motion.button
              className="group relative px-10 py-4 rounded-2xl glass-button text-cyan-300 font-bold text-lg flex items-center justify-center gap-2 overflow-hidden"
              style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative">Quay Lại Trang Chủ</span>
            </motion.button>
          </Link>
        </motion.div>


      </motion.div>

      <motion.button
        onClick={scrollToSection}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-current flex items-start justify-center p-1">
          <motion.div
            className="w-1.5 h-2.5 rounded-full bg-current"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
        <span className="text-xs font-medium" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>Cuộn xuống</span>
      </motion.button>
    </section>
  );
}
