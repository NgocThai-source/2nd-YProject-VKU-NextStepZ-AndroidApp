'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Briefcase, Rocket, Users, Code } from 'lucide-react';
import Link from 'next/link';

const trustedPartners = [
  { name: 'VKU', icon: <Briefcase className="w-7 h-7 text-cyan-400" />, sub: 'Trường ĐH CNTT & TT Việt - Hàn' },
  { name: 'Startup Sinh Viên', icon: <Rocket className="w-7 h-7 text-purple-400" />, sub: 'Định hướng & hợp tác dự án' },
  { name: 'Cựu Sinh Viên VKU', icon: <Users className="w-7 h-7 text-cyan-400" />, sub: 'Mentoring – chia sẻ kinh nghiệm' },
  { name: 'Cộng Đồng IT Đà Nẵng', icon: <Code className="w-7 h-7 text-blue-400" />, sub: 'Nơi kết nối và học hỏi' },
];

export default function CTASection() {
  return (
    <section className="relative w-full py-24 md:py-36 px-4 md:px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(34, 211, 238, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(34, 211, 238, 0.15) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, transparent 60%)',
            filter: 'blur(100px)',
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, 80, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 60%)',
            filter: 'blur(100px)',
          }}
          animate={{
            x: [0, -100, 0],
            y: [0, -80, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          animate={{ backgroundPosition: ['0px 0px', '80px 80px'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          style={{
            backgroundImage: 'linear-gradient(45deg, #22d3ee 1px, transparent 1px), linear-gradient(-45deg, #22d3ee 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, (i % 2 === 0 ? 20 : -20), 0],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 5 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}
      </div>
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          className="space-y-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div className="flex justify-center">
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
                Khám Phá Cơ Hội Dành Riêng Cho Bạn
              </span>
              <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </motion.div>
            </motion.div>
          </motion.div>
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight" style={{ fontFamily: "'Poppins ExtraBold', sans-serif" }}>
              <span className="gradient-text-premium">
                Bắt Đầu Hành Trình
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                Sự Nghiệp Thông Minh
              </span>
            </h2>

            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
              Không cần chờ đợi. <span className="text-cyan-300 font-semibold">Khám phá điểm mạnh, nâng tầm hồ sơ</span> và
              <span className="text-blue-300 font-semibold"> mở khóa những cơ hội phù hợp nhất</span> dành riêng cho bạn.
              <br />
              <span className="text-purple-300 font-semibold">NextStepZ</span> - nơi mỗi bước đi nhỏ hôm nay dẫn bạn đến tương lai lớn.
            </p>
          </div>
          <motion.div
            className="flex flex-col sm:flex-row gap-5 justify-center pt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link href="/auth">
              <motion.button
                className="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg flex items-center justify-center gap-3 overflow-hidden shadow-xl"
                style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-cyan-400/20 to-blue-400/20 blur-xl" />

                <span className="relative flex items-center gap-2">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <Zap className="w-5 h-5" />
                  </motion.div>
                  Tham Gia Ngay
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </Link>

            <Link href="/portfolio">
              <motion.button
                className="group relative px-10 py-5 rounded-2xl glass-button text-cyan-300 font-bold text-lg flex items-center justify-center gap-2 overflow-hidden"
                style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 0.5 }}
                />
                <span className="relative flex items-center gap-2">
                  Xây Dựng Hồ Sơ
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                </span>
              </motion.button>
            </Link>
          </motion.div>
          <motion.div
            className="pt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="section-divider mb-10" />

            <p className="text-center text-sm text-gray-400 mb-8 font-medium tracking-widest" style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>
              ĐƯỢC KẾT NỐI VỚI
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trustedPartners.map((partner, idx) => (
                <motion.div
                  key={idx}
                  className="group glass-card glass-card-hover rounded-xl p-5 text-center cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <motion.div
                    className="mb-3 flex justify-center"
                    whileHover={{ scale: 1.15, rotate: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {partner.icon}
                  </motion.div>
                  <p className="text-sm font-bold text-gray-200 group-hover:text-cyan-300 transition-colors mb-1" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
                    {partner.name}
                  </p>
                  <p className="text-xs text-gray-500" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                    {partner.sub}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
    </section>
  );
}
