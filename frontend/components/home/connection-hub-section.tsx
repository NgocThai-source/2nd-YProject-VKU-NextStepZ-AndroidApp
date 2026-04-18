'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';

interface ConnectionNode {
  icon: React.ReactNode;
  emoji: string;
  title: string;
  description: string;
  features: string[];
  gradient: string;
  iconBg: string;
  glowColor: string;
}

const connectionNodes: ConnectionNode[] = [
  {
    icon: <GraduationCap className="w-7 h-7" />,
    emoji: '🎓',
    title: 'Sinh Viên',
    description: 'Tìm kiếm định hướng, phát triển kỹ năng, và khám phá cơ hội nghề nghiệp phù hợp.',
    features: ['Định hướng sự nghiệp', 'Phát triển kỹ năng', 'Tiếp cận cơ hội'],
    gradient: 'from-blue-600/25 to-cyan-600/15',
    iconBg: 'from-blue-500 to-cyan-500',
    glowColor: 'rgba(34, 211, 238, 0.3)',
  },
  {
    icon: <Briefcase className="w-7 h-7" />,
    emoji: '💼',
    title: 'Nhà Tuyển Dụng',
    description: 'Tìm kiếm tài năng trẻ, năng động, có kỹ năng phù hợp để phát triển doanh nghiệp.',
    features: ['Tìm tài năng trẻ', 'Xây dựng thương hiệu', 'Tuyển dụng hiệu quả'],
    gradient: 'from-purple-600/25 to-pink-600/15',
    iconBg: 'from-purple-500 to-pink-500',
    glowColor: 'rgba(168, 85, 247, 0.3)',
  },
  {
    icon: <Users className="w-7 h-7" />,
    emoji: '👥',
    title: 'Cựu Sinh Viên',
    description: 'Chia sẻ kinh nghiệm, mentoring, và xây dựng cộng đồng hỗ trợ lẫn nhau.',
    features: ['Mentoring & chia sẻ', 'Xây dựng mạng lưới', 'Phát triển bền vững'],
    gradient: 'from-emerald-600/25 to-teal-600/15',
    iconBg: 'from-emerald-500 to-teal-500',
    glowColor: 'rgba(16, 185, 129, 0.3)',
  },
];

const benefitItems = [
  {
    title: 'Phát Triển Năng Lực',
    description: 'Mở rộng kỹ năng, tích lũy kinh nghiệm từ thực tế và chuyên gia.',
    icon: '🚀',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    title: 'Mở Rộng Cơ Hội',
    description: 'Tiếp cận việc làm, dự án và mạng lưới chuyên nghiệp chất lượng.',
    icon: '🌐',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Định Hướng Tương Lai',
    description: 'Tự tin vạch ra con đường sự nghiệp phù hợp với đam mê và năng lực.',
    icon: '💡',
    gradient: 'from-emerald-500 to-teal-500',
  },
];

export default function ConnectionHubSection() {
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
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7 },
    },
  };

  return (
    <section className="relative w-full py-24 md:py-36 px-4 sm:px-6 md:px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
          animate={{
            x: [0, 80, 0],
            y: [0, 60, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{ duration: 18, repeat: Infinity, delay: 2 }}
        />
        <motion.div
          className="absolute inset-0 opacity-[0.02]"
          animate={{
            backgroundPosition: ['0px 0px', '100px 100px'],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          style={{
            backgroundImage: 'linear-gradient(45deg, #22d3ee 1px, transparent 1px), linear-gradient(-45deg, #22d3ee 1px, transparent 1px)',
            backgroundSize: '80px 80px',
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
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </motion.div>
            <span className="text-sm font-semibold text-cyan-300" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
              Hệ Sinh Thái Kết Nối
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text-premium" style={{ fontFamily: "'Poppins ExtraBold', sans-serif" }}>
              Cầu Nối Kết Nối 3 Bên
            </span>
          </h2>

          <p
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
          >
            Ba nhóm người không chỉ kết nối, mà còn cùng nhau
            <span className="text-cyan-300 font-semibold"> tạo giá trị, nuôi dưỡng cơ hội và kiến tạo tương lai</span> trong Hệ Sinh Thái NextStepZ.
          </p>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {connectionNodes.map((node, idx) => (
            <motion.div
              key={idx}
              className="group relative"
              variants={itemVariants}
            >
              <motion.div
                className={`relative h-full p-8 rounded-3xl bg-gradient-to-br ${node.gradient} glass-card-strong overflow-hidden`}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{
                  boxShadow: `0 20px 50px -10px ${node.glowColor}`,
                }}
              >
                <motion.div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${node.glowColor}, transparent, ${node.glowColor})`,
                    backgroundSize: '200% 200%',
                    padding: '1px',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div
                  className="text-5xl md:text-6xl mb-6"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: idx * 0.2 }}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  {node.emoji}
                </motion.div>
                <h3
                  className="text-2xl font-bold text-white mb-3"
                  style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                >
                  {node.title}
                </h3>
                <p
                  className="text-gray-300 text-sm leading-relaxed mb-6"
                  style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                >
                  {node.description}
                </p>
                <div className="space-y-2">
                  {node.features.map((feature, fIdx) => (
                    <motion.div
                      key={fIdx}
                      className="flex items-center gap-2 text-gray-300 text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 + fIdx * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ x: 4 }}
                    >
                      <motion.div
                        className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${node.iconBg}`}
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: fIdx * 0.2 }}
                      />
                      <span style={{ fontFamily: "'Poppins Regular', sans-serif" }}>{feature}</span>
                    </motion.div>
                  ))}
                </div>
                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${node.iconBg} blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
        <div className="hidden md:block relative h-24 mb-16">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="connectionFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
                <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 100 40 Q 350 80 600 40 Q 850 0 1100 40"
              stroke="url(#connectionFlow)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              viewport={{ once: true }}
            />
          </svg>
        </div>
        <motion.div
          className="relative p-8 md:p-12 rounded-3xl glass-card-strong overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(168, 85, 247, 0.1), rgba(59, 130, 246, 0.1))',
              backgroundSize: '200% 200%',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />

          <div className="relative z-10">
            <div className="text-center mb-12">
              <motion.div
                className="text-5xl md:text-6xl mb-4"
                animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                🧭
              </motion.div>
              <h3
                className="text-2xl md:text-3xl font-bold text-white mb-4"
                style={{ fontFamily: "'Poppins ExtraBold', sans-serif" }}
              >
                Kiến Tạo Tương Lai Nghề Nghiệp
              </h3>
              <p
                className="text-gray-300 max-w-3xl mx-auto"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              >
                Từ những kết nối ý nghĩa giữa sinh viên, nhà tuyển dụng và cựu sinh viên, NextStepZ mở ra
                <span className="text-cyan-300 font-semibold"> hệ sinh thái nghề nghiệp toàn diện</span>.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {benefitItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300`} />

                  <motion.div
                    className="text-4xl mb-4"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: idx * 0.2 }}
                  >
                    {item.icon}
                  </motion.div>

                  <h4
                    className={`text-xl font-bold mb-2 bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}
                    style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                  >
                    {item.title}
                  </h4>
                  <p
                    className="text-gray-400 text-sm leading-relaxed"
                    style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                  >
                    {item.description}
                  </p>
                  <motion.div
                    className={`mt-4 h-1 bg-gradient-to-r ${item.gradient} rounded-full`}
                    initial={{ width: 0 }}
                    whileInView={{ width: '60%' }}
                    transition={{ delay: idx * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                  />
                </motion.div>
              ))}
            </div>
            <motion.div
              className="text-center mt-10 pt-8 border-t border-white/10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-gray-400 flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                >
                  ⚡
                </motion.span>
                <span style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
                  NextStepZ – nơi mỗi kết nối trở thành bước đệm cho hành trình tương lai.
                </span>
                <motion.span
                  animate={{ rotate: -360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                >
                  ⚡
                </motion.span>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
