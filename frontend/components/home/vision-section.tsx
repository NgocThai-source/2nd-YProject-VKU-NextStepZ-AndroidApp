'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, Award, Target, ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface TimelineStep {
  title: string;
  description: string;
  emoji: string;
  highlights: string[];
  gradient: string;
  accentColor: string;
}

const timelineSteps: TimelineStep[] = [
  {
    title: 'Sinh Viên Năm 1',
    description: 'Khám phá đam mê, tìm hiểu các lĩnh vực, xây dựng nền tảng kỹ năng cơ bản.',
    emoji: '🎓',
    highlights: ['Khám phá lĩnh vực', 'Xây dựng nền tảng', 'Phát triển kỹ năng'],
    gradient: 'from-blue-500/20 to-cyan-500/10',
    accentColor: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Sinh Viên Năm 2-3',
    description: 'Nâng cao kỹ năng, thực tập, xây dựng portfolio, mở rộng mạng lưới chuyên môn.',
    emoji: '📚',
    highlights: ['Thực tập chuyên đề', 'Xây dựng portfolio', 'Mở rộng mạng lưới'],
    gradient: 'from-cyan-500/20 to-purple-500/10',
    accentColor: 'from-cyan-500 to-purple-500',
  },
  {
    title: 'Sinh Viên Cuối Khoá',
    description: 'Tìm việc làm chính thức, chuẩn bị cho sự nghiệp, kết nối với mentor hướng dẫn.',
    emoji: '🚀',
    highlights: ['Tìm việc chính thức', 'Chuẩn bị phỏng vấn', 'Kết nối mentor'],
    gradient: 'from-purple-500/20 to-pink-500/10',
    accentColor: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Cựu Sinh Viên',
    description: 'Phát triển sự nghiệp, chia sẻ kinh nghiệm, mentoring và hỗ trợ thế hệ sau.',
    emoji: '⭐',
    highlights: ['Phát triển sự nghiệp', 'Chia sẻ kinh nghiệm', 'Mentoring'],
    gradient: 'from-pink-500/20 to-rose-500/10',
    accentColor: 'from-pink-500 to-rose-500',
  },
];

const successStories = [
  {
    name: 'Hồng Anh',
    journey: 'Sinh Viên Năm 3 → Thực Tập Sinh Marketing',
    company: 'tại Công Ty XYZ',
    quote: 'Trước đây mình không biết phải bắt đầu từ đâu. Nhờ NextStepZ, mình định hướng ngành marketing và kết nối được mentor.',
    highlights: ['Xác định thế mạnh qua Career AI', 'Xây dựng portfolio marketing', 'Ứng tuyển thành công'],
    results: ['Có offer trong 3 tuần', 'Portfolio chuyên nghiệp'],
    image: '/images/picnv1.jpg',
    gradient: 'from-blue-500/25 to-cyan-500/15',
    accentColor: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Minh Đức',
    journey: 'Portfolio từ 0 → Offer 12 triệu/tháng',
    company: 'ngành Frontend',
    quote: 'NextStepZ giúp mình có roadmap học rõ ràng, gợi ý kỹ năng còn thiếu và hỗ trợ tối ưu CV bằng AI.',
    highlights: ['Học theo roadmap AI', 'Hoàn thiện portfolio dự án', 'Kết nối doanh nghiệp'],
    results: ['Offer 12 triệu/tháng', 'Tương lai rõ ràng'],
    image: '/images/picnv1.jpg',
    gradient: 'from-purple-500/25 to-pink-500/15',
    accentColor: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Thảo My',
    journey: 'Sinh Viên Trái Ngành → Junior Designer',
    company: 'tại Studio Thiết Kế',
    quote: 'Nhờ hệ sinh thái NextStepZ, mình chuyển ngành thành công. Career Test cho thấy phù hợp ngành design.',
    highlights: ['Career Test định hướng', 'Mentoring 1-1', 'Apply studio thành công'],
    results: ['Chuyển ngành sau 4 tháng', 'Portfolio bắt mắt'],
    image: '/images/picnv1.jpg',
    gradient: 'from-emerald-500/25 to-teal-500/15',
    accentColor: 'from-emerald-500 to-teal-500',
  },
];

export default function VisionSection() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="relative w-full py-24 md:py-36 px-4 md:px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
          animate={{ x: [0, 100, 0], y: [0, -80, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
          animate={{ x: [0, -80, 0], y: [0, 80, 0] }}
          transition={{ duration: 18, repeat: Infinity, delay: 3 }}
        />
        <motion.div
          className="absolute inset-0 opacity-[0.02]"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          style={{
            backgroundImage: 'radial-gradient(circle, #22d3ee 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full premium-badge mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
              <Target className="w-4 h-4 text-cyan-400" />
            </motion.div>
            <span className="text-sm font-semibold text-cyan-300" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
              Hành Trình Biến Đổi Sự Nghiệp
            </span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text-premium" style={{ fontFamily: "'Poppins ExtraBold', sans-serif" }}>
              Từ Giấc Mơ Đến Hiện Thực
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-400 max-w-4xl mx-auto" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
            Mỗi bước tiến đều là <span className="text-cyan-300 font-semibold">một dấu mốc quan trọng</span> trong hành trình sự nghiệp.
            NextStepZ đồng hành để bạn <span className="text-blue-300 font-semibold">mở ra phiên bản tốt hơn</span> của chính mình.
          </p>
        </motion.div>
        <motion.div
          className="mb-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}>
              Hành Trình 4 Giai Đoạn
            </h3>
            <p className="text-gray-400" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
              Theo dõi quá trình phát triển từ sinh viên đến cựu sinh viên
            </p>
          </div>
          <div className="hidden md:block relative h-1 bg-gradient-to-r from-blue-500/20 via-cyan-500/40 to-purple-500/20 rounded-full mb-8" />
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {timelineSteps.map((step, idx) => (
              <motion.div
                key={idx}
                className="relative"
                variants={itemVariants}
                onMouseEnter={() => setActiveCard(idx)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <motion.div
                  className="hidden md:flex w-12 h-12 rounded-full bg-white border-4 border-slate-900 items-center justify-center text-slate-900 font-black text-lg shadow-xl mx-auto mb-4 relative z-10"
                  animate={{
                    scale: activeCard === idx ? 1.2 : 1,
                    boxShadow: activeCard === idx ? '0 0 30px rgba(34, 211, 238, 0.6)' : '0 0 15px rgba(34, 211, 238, 0.2)',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {idx + 1}
                </motion.div>
                <motion.div
                  className={`relative p-5 rounded-2xl bg-gradient-to-br ${step.gradient} glass-card overflow-hidden min-h-[280px]`}
                  animate={{ y: activeCard === idx ? -8 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <motion.div
                    className="text-3xl mb-3"
                    animate={activeCard === idx ? { scale: 1.2, rotate: 10 } : { scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {step.emoji}
                  </motion.div>

                  <h4 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
                    {step.title}
                  </h4>

                  <motion.div
                    className={`h-0.5 bg-gradient-to-r ${step.accentColor} rounded-full mb-3 origin-left`}
                    animate={{ scaleX: activeCard === idx ? 1 : 0.3 }}
                    transition={{ duration: 0.4 }}
                  />

                  <p className="text-gray-300 text-sm mb-4" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                    {step.description}
                  </p>
                  <motion.div
                    className="space-y-1.5"
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: activeCard === idx ? 1 : 0.7 }}
                  >
                    {step.highlights.map((highlight, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-2 text-gray-400 text-xs">
                        <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${step.accentColor}`} />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </motion.div>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${step.accentColor}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(idx + 1) * 25}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        viewport={{ once: true }}
                      />
                    </div>
                    <span className="text-xs font-bold text-cyan-300">{(idx + 1) * 25}%</span>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        
      </div>
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
