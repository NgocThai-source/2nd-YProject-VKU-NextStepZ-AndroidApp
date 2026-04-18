'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Briefcase, Map, Users, Brain, LineChart, Sparkles, ArrowRight, MessageCircle } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  image: string;
  benefits: string[];
  gradient: string;
  accentColor: string;
}

const features: Feature[] = [
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: 'Sáng Tạo Hồ Sơ',
    description: 'Xây dựng hồ sơ chuyên nghiệp, trưng bày dự án, và thể hiện tài năng của bạn một cách ấn tượng.',
    image: '/images/por.png',
    benefits: ['Hoạt động ngay lập tức', 'Tối ưu trải nghiệm', 'Bộ lọc thông minh'],
    gradient: 'from-cyan-500/20 to-blue-500/10',
    accentColor: 'from-cyan-500 to-blue-500',
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'Đề Xuất Thông Minh',
    description: 'Công nghệ AI thông minh gợi ý việc làm, dự án, và cơ hội phù hợp với kỹ năng của bạn.',
    image: '/images/rec.png',
    benefits: ['Gợi ý việc làm phù hợp', 'Phân tích năng lực AI', 'Cá nhân hóa 100%'],
    gradient: 'from-purple-500/20 to-pink-500/10',
    accentColor: 'from-purple-500 to-pink-500',
  },
  {
    icon: <Map className="w-6 h-6" />,
    title: 'Job Map',
    description: 'Bản đồ tương tác hiển thị các cơ hội việc làm theo lĩnh vực, địa điểm, và kỹ năng yêu cầu.',
    image: '/images/jobmap.png',
    benefits: ['Tìm việc quanh bạn', 'Khám phá trên bản đồ', 'Xem theo vị trí'],
    gradient: 'from-blue-500/20 to-indigo-500/10',
    accentColor: 'from-blue-500 to-indigo-500',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Cộng Đồng',
    description: 'Chia sẻ kinh nghiệm, học hỏi từ những người khác, và xây dựng mạng lưới chuyên môn.',
    image: '/images/community.png',
    benefits: ['Chia sẻ kinh nghiệm', 'Kết nối – Hỏi đáp', 'Không gian sinh viên'],
    gradient: 'from-emerald-500/20 to-teal-500/10',
    accentColor: 'from-emerald-500 to-teal-500',
  },
  {
    icon: <LineChart className="w-6 h-6" />,
    title: 'Công Ty',
    description: 'Khám phá doanh nghiệp phù hợp với định hướng của bạn và tìm hiểu văn hóa công ty.',
    image: '/images/companies.png',
    benefits: ['Công ty hàng đầu', 'Văn hoá doanh nghiệp', 'Kết nối trực tiếp'],
    gradient: 'from-orange-500/20 to-amber-500/10',
    accentColor: 'from-orange-500 to-amber-500',
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: 'Nhắn Tin',
    description: 'Trò chuyện trực tiếp với nhà tuyển dụng, mentor và bạn bè trong cộng đồng NextStepZ.',
    image: '/images/chat.png',
    benefits: ['Chat trực tiếp', 'Hỗ trợ 24/7', 'Kết nối nhanh chóng'],
    gradient: 'from-rose-500/20 to-red-500/10',
    accentColor: 'from-rose-500 to-red-500',
  },
];

const reasons = [
  {
    number: '1',
    title: 'Hệ Sinh Thái Toàn Diện',
    desc: 'Tìm việc, xây CV, portfolio, kết nối cộng đồng – tất cả tại một nơi.',
    icon: '🌐',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    number: '2',
    title: 'Tối Ưu Hóa Bằng AI',
    desc: 'Phân tích năng lực, gợi ý nghề, tối ưu CV/portfolio theo nhà tuyển dụng.',
    icon: '🤖',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    number: '3',
    title: 'Cơ Hội Chất Lượng',
    desc: 'Kết nối với hàng ngàn doanh nghiệp uy tín.',
    icon: '⭐',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    number: '4',
    title: 'Hỗ Trợ 24/7',
    desc: 'AI và cộng đồng luôn đồng hành cùng bạn.',
    icon: '🎯',
    gradient: 'from-orange-500 to-amber-500',
  },
];

export default function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
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
    <section className="relative w-full py-24 md:py-36 px-4 md:px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, delay: 2 }}
        />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'linear-gradient(45deg, #22d3ee 1px, transparent 1px), linear-gradient(-45deg, #22d3ee 1px, transparent 1px)',
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
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </motion.div>
            <span className="text-sm font-semibold text-cyan-300" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
              Nền Tảng Kết Nối NextStepZ
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text-premium" style={{ fontFamily: "'Poppins ExtraBold', sans-serif" }}>
              Khám Phá Hệ Sinh Thái Thông Minh
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-400 max-w-4xl mx-auto" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
            Trải nghiệm những công cụ hỗ trợ toàn diện cho <span className="text-cyan-300 font-semibold">hành trình nghề nghiệp của bạn</span>
          </p>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="group relative"
              variants={itemVariants}
            >
              <motion.div
                className={`relative h-full rounded-3xl bg-gradient-to-br ${feature.gradient} glass-card overflow-hidden min-h-[320px]`}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, transparent, rgba(34, 211, 238, 0.3), transparent)`,
                    padding: '1px',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                />
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                  <div className={`absolute top-4 left-4 w-10 h-10 rounded-xl bg-gradient-to-br ${feature.accentColor} flex items-center justify-center text-white font-bold shadow-lg`}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.accentColor} text-white`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
                      {feature.title}
                    </h3>
                  </div>

                  <p className="text-gray-400 text-sm mb-4" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                    {feature.description}
                  </p>
                  <div className="space-y-1.5">
                    {feature.benefits.map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2 text-gray-300 text-sm">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.accentColor}`} />
                        <span style={{ fontFamily: "'Poppins Regular', sans-serif" }}>{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <motion.button
                    className={`mt-4 px-4 py-2 rounded-xl bg-gradient-to-r ${feature.accentColor} text-white font-semibold text-sm flex items-center gap-2`}
                    style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Khám Phá
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000 pointer-events-none"
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <div className="section-divider mb-16" />

          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Poppins ExtraBold', sans-serif" }}>
              <span className="gradient-text-premium">Vậy Tại Sao Chọn NextStepZ?</span>
            </h3>
            <p className="text-gray-400 text-lg" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
              <span className="text-cyan-300 font-semibold">NextStepZ trao cho bạn lợi thế thực sự</span> trên hành trình sự nghiệp.
            </p>
          </div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {reasons.map((reason, idx) => (
              <motion.div
                key={idx}
                className="group relative"
                variants={itemVariants}
              >
                <motion.div
                  className="relative h-full p-6 rounded-2xl glass-card hover:glass-card-hover transition-all duration-300"
                  whileHover={{ y: -8 }}
                >
                  <motion.div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${reason.gradient} flex items-center justify-center mb-4 shadow-lg`}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: idx * 0.15 }}
                  >
                    <span className="text-xl font-black text-white">{reason.number}</span>
                  </motion.div>

                  <h4 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
                    {reason.title}
                  </h4>
                  <p className="text-gray-400 text-sm" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                    {reason.desc}
                  </p>
                  <motion.div
                    className={`mt-4 h-1 bg-gradient-to-r ${reason.gradient} rounded-full`}
                    initial={{ width: 0 }}
                    whileInView={{ width: '50%' }}
                    transition={{ delay: idx * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
          >
            <h4 className="text-2xl md:text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Poppins ExtraBold', sans-serif" }}>
              <span className="gradient-text-premium">NextStepZ Mang Đến Giá Trị Gì Cho Bạn?</span>
            </h4>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
              Mỗi tính năng được xây dựng nhằm giúp <span className="text-cyan-300 font-semibold">sinh viên, nhà tuyển dụng</span> và
              <span className="text-cyan-300 font-semibold"> cựu sinh viên</span> đạt được mục tiêu <span className="text-emerald-300 font-semibold">nhanh hơn, thông minh hơn</span>.
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
          >
            {[
              { value: '45%', label: 'Tăng Cơ Hội Việc Làm', sub: 'Nhờ AI CV Builder & Job Match', icon: '📈', gradient: 'from-cyan-500 to-blue-500' },
              { value: '10K+', label: 'Cơ Hội Từ Doanh Nghiệp', sub: 'Cập nhật liên tục từ đối tác', icon: '🏢', gradient: 'from-purple-500 to-pink-500' },
              { value: '92%', label: 'Phản Hồi AI Dưới 5 Giây', sub: 'Hỗ trợ 24/7 theo nhu cầu', icon: '🤖', gradient: 'from-emerald-500 to-teal-500' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className="stats-card rounded-2xl p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 + 0.7 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="text-4xl mb-3"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: idx * 0.2 }}
                >
                  {stat.icon}
                </motion.div>
                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`} style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}>
                  {stat.value}
                </div>
                <div className="text-white font-semibold mb-1" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
                  {stat.label}
                </div>
                <div className="text-gray-400 text-sm" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                  {stat.sub}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
