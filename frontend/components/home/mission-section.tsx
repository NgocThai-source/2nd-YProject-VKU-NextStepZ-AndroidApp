'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Lightbulb, Users, Rocket, Sparkles } from 'lucide-react';

interface MissionItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  iconBg: string;
}

const missionItems: MissionItem[] = [
  {
    icon: <Target className="w-7 h-7" />,
    title: 'Định Hướng Sự Nghiệp',
    description: 'Giúp sinh viên khám phá đam mê, xác định mục tiêu và vạch rõ con đường nghề nghiệp phù hợp với năng lực và ước mơ cá nhân.',
    gradient: 'from-cyan-500/20 to-blue-500/10',
    iconBg: 'from-cyan-500 to-blue-500',
  },
  {
    icon: <Lightbulb className="w-7 h-7" />,
    title: 'Phát Triển Kỹ Năng',
    description: 'Mang đến nền tảng học tập hiện đại, giúp sinh viên rèn luyện chuyên môn và kỹ năng mềm, sẵn sàng chinh phục thị trường.',
    gradient: 'from-purple-500/20 to-pink-500/10',
    iconBg: 'from-purple-500 to-pink-500',
  },
  {
    icon: <Users className="w-7 h-7" />,
    title: 'Kết Nối Cộng Đồng',
    description: 'Xây dựng mạng lưới gắn kết sinh viên, cựu sinh viên và nhà tuyển dụng trong cộng đồng học hỏi – chia sẻ – phát triển.',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    iconBg: 'from-emerald-500 to-teal-500',
  },
  {
    icon: <Rocket className="w-7 h-7" />,
    title: 'Tìm Cơ Hội Việc Làm',
    description: 'Ứng dụng công nghệ AI để gợi ý công việc, dự án và cơ hội phù hợp, giúp mỗi sinh viên tìm thấy lối đi đúng.',
    gradient: 'from-orange-500/20 to-amber-500/10',
    iconBg: 'from-orange-500 to-amber-500',
  },
];

export default function MissionSection() {
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
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section
      id="mission-section"
      className="relative w-full py-24 md:py-36 px-4 md:px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 60%)',
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 60%)',
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(90deg, #22d3ee 1px, transparent 1px), linear-gradient(#22d3ee 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
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
              Sứ Mệnh Của Chúng Tôi
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span
              className="gradient-text-premium"
              style={{ fontFamily: "'Poppins ExtraBold', sans-serif" }}
            >
              Tại Sao NextStepZ Ra Đời?
            </span>
          </h2>

          <p
            className="text-lg md:text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
          >
            Sinh viên ngày nay đang đối mặt với nhiều thách thức —
            <span className="text-cyan-300 font-semibold"> thiếu định hướng, thiếu kết nối</span> và
            <span className="text-cyan-300 font-semibold"> thiếu cơ hội</span> phát triển bản thân.
            <span className="text-cyan-300 font-semibold"> NextStepZ</span> ra đời để đồng hành cùng họ.
          </p>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {missionItems.map((item, idx) => (
            <motion.div
              key={idx}
              className="group relative"
              variants={itemVariants}
            >
              <motion.div
                className={`relative h-full p-6 rounded-2xl bg-gradient-to-br ${item.gradient} glass-card overflow-hidden`}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.3), rgba(168, 85, 247, 0.3), rgba(34, 211, 238, 0.3))',
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
                  className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${item.iconBg} flex items-center justify-center mb-5 shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <div className="absolute inset-0 rounded-xl bg-inherit blur-xl opacity-50" />
                  <div className="relative text-white">
                    {item.icon}
                  </div>
                </motion.div>
                <h3
                  className="text-xl font-bold text-white mb-3"
                  style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-gray-400 leading-relaxed text-sm"
                  style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                >
                  {item.description}
                </p>
                <motion.div
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${item.iconBg} rounded-b-2xl`}
                  initial={{ width: '0%' }}
                  whileInView={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000"
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          className="mt-20 relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div
            className="absolute inset-0 rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(168, 85, 247, 0.1), rgba(59, 130, 246, 0.1))',
              backgroundSize: '200% 200%',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />

          <div className="relative glass-card-strong rounded-3xl p-8 md:p-12 text-center overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-br-full" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-tl-full" />
            <motion.div
              className="text-5xl md:text-6xl mb-6"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              ✨
            </motion.div>

            <h3
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              style={{ fontFamily: "'Poppins ExtraBold', sans-serif" }}
            >
              Tầm Nhìn
            </h3>

            <p
              className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto"
              style={{ fontFamily: "'Poppins Regular', sans-serif" }}
            >
              NextStepZ hướng tới trở thành
              <span className="text-cyan-300 font-semibold"> nền tảng sinh viên – việc làm – cộng đồng số 1</span> cho thế hệ trẻ định hướng tương lai.
              Nơi sinh viên có thể khám phá tiềm năng, kết nối với những người cùng chí hướng & kiến tạo tương lai sự nghiệp toàn diện.
            </p>
            <div className="flex justify-center gap-2 mt-8">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-cyan-400"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
