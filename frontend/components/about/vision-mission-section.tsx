'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Rocket, CheckCircle2, Sparkles } from 'lucide-react';

export default function VisionMissionSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8 },
    },
  };

  const visionPoints = [
    'Xây dựng hệ sinh thái hỗ trợ phát triển sự nghiệp cho sinh viên',
    'Giúp mỗi cá nhân khám phá tiềm năng thật sự của bản thân',
    'Mang đến cơ hội kết nối chân thực giữa sinh viên và doanh nghiệp',
    'Hỗ trợ xây dựng sự nghiệp bền vững và phù hợp với năng lực',
  ];

  const missionPoints = [
    'Khám phá đam mê và tiềm năng nghề nghiệp',
    'Phát triển kỹ năng thực chiến',
    'Tìm kiếm công việc đúng chuyên ngành hoặc part-time phù hợp',
    'Xây dựng mạng lưới chuyên môn vững chắc cho tương lai',
  ];

  return (
    <section className="relative w-full py-24 md:py-36 px-4 md:px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 60%)',
            filter: 'blur(100px)',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 left-0 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, transparent 60%)',
            filter: 'blur(100px)',
          }}
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-400/30">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
                Định Hướng Phát Triển
              </span>
            </div>
          </motion.div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Poppins ExtraBold', sans-serif" }}
          >
            <span className="gradient-text-premium">
              Hướng Đi & Mục Tiêu
            </span>
            <br />
            <span className="text-white">của NextStepZ</span>
          </h2>
          <p
            className="text-gray-400 text-base md:text-lg max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
          >
            Xây dựng nền tảng định hướng và kết nối nghề nghiệp dành cho sinh viên. Mang đến cơ hội thực tập, việc làm và part-time phù hợp.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div
            variants={itemVariants}
            className="group relative"
            whileHover={{ y: -8 }}
          >
            <motion.div
              className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-cyan-500/30 to-blue-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"
            />

            <div className="relative h-full glass-card-strong rounded-3xl p-8 md:p-10 border border-cyan-400/20 group-hover:border-cyan-400/50 transition-all duration-300">
              <motion.div
                className="mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Eye className="w-8 h-8 text-white" />
              </motion.div>

              <h3
                className="text-2xl md:text-3xl font-bold text-cyan-300 mb-4"
                style={{ fontFamily: "'Poppins SemiBold', sans-serif" }}
              >
                Tầm Nhìn
              </h3>

              <p
                className="text-gray-300 text-base md:text-lg leading-relaxed mb-6"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              >
                Trở thành nền tảng định hướng nghề nghiệp uy tín dành cho sinh viên — nơi kết nối các bạn trẻ với nhà tuyển dụng và những người dẫn dắt trong ngành.
              </p>

              <ul className="space-y-3 mb-6">
                {visionPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <span style={{ fontFamily: "'Poppins Regular', sans-serif" }}>{point}</span>
                  </li>
                ))}
              </ul>

              <p
                className="text-gray-400 text-sm leading-relaxed"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              >
                NextStepZ hướng đến việc trở thành người bạn đồng hành lâu dài trên hành trình nghề nghiệp của bạn.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="group relative"
            whileHover={{ y: -8 }}
          >
            <motion.div
              className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"
            />

            <div className="relative h-full glass-card-strong rounded-3xl p-8 md:p-10 border border-purple-400/20 group-hover:border-purple-400/50 transition-all duration-300">
              <motion.div
                className="mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                <Rocket className="w-8 h-8 text-white" />
              </motion.div>

              <h3
                className="text-2xl md:text-3xl font-bold text-purple-300 mb-4"
                style={{ fontFamily: "'Poppins SemiBold', sans-serif" }}
              >
                Sứ Mệnh
              </h3>

              <p
                className="text-gray-300 text-base md:text-lg leading-relaxed mb-6"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              >
                NextStepZ mang sứ mệnh cung cấp công cụ, tài nguyên và cộng đồng đáng tin cậy giúp sinh viên:
              </p>

              <ul className="space-y-3 mb-6">
                {missionPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <span style={{ fontFamily: "'Poppins Regular', sans-serif" }}>{point}</span>
                  </li>
                ))}
              </ul>

              <p
                className="text-gray-400 text-sm leading-relaxed"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              >
                Chúng mình hướng đến việc tạo ra một nền tảng đồng hành lâu dài, giúp sinh viên tự tin bước vào thị trường lao động.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="section-divider mt-24" />
    </section>
  );
}
