'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Lightbulb, Users, Target, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function OurStorySection() {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const highlights = [
    {
      icon: <Lightbulb className="w-5 h-5" />,
      text: 'Kết nối sinh viên với cơ hội thực tập, việc làm và part-time phù hợp',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: 'Xây dựng cộng đồng học tập – chia sẻ kinh nghiệm thực tế từ người đi trước',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Target className="w-5 h-5" />,
      text: 'Hỗ trợ doanh nghiệp tiếp cận và tìm kiếm tài năng trẻ đầy tiềm năng',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: <CheckCircle2 className="w-5 h-5" />,
      text: 'Ứng dụng công nghệ AI để cá nhân hoá lộ trình và trải nghiệm người dùng',
      color: 'from-orange-500 to-amber-500',
    },
  ];

  return (
    <section
      id="story-section"
      className="relative w-full py-24 md:py-36 px-4 md:px-8 bg-gradient-to-b from-slate-900 to-slate-950"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
                Câu Chuyện Của Chúng Tôi
              </span>
            </div>
          </motion.div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Poppins ExtraBold', sans-serif" }}
          >
            <span className="gradient-text-premium">
              Một Hành Trình Bắt Đầu
            </span>
            <br />
            <span className="text-white">Từ Nhu Cầu Thực Tế</span>
          </h2>
          <p
            className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto"
            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
          >
            Điều đã thôi thúc chúng tôi xây dựng NextStepZ
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <div className="glass-card rounded-2xl p-6">
              <p
                className="text-gray-300 leading-relaxed text-base md:text-lg mb-4"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              >
                NextStepZ ra đời từ thực trạng hàng nghìn sinh viên mỗi năm phải đối mặt với áp lực tìm việc, thiếu trải nghiệm thực tế, kỹ năng chưa đủ và không biết đâu là cơ hội phù hợp cho mình.
              </p>
              <p
                className="text-gray-300 leading-relaxed text-base md:text-lg"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              >
                Chúng mình không chỉ muốn tạo ra một nền tảng tìm việc đơn thuần — mà mong xây dựng một <span className="text-cyan-300 font-semibold">hệ sinh thái hỗ trợ sinh viên phát triển sự nghiệp</span> một cách bền vững, rõ ràng và đúng hướng.
              </p>
            </div>

            <motion.div variants={containerVariants} className="space-y-3">
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group glass-card glass-card-hover rounded-xl p-4 flex items-start gap-4 cursor-pointer"
                  whileHover={{ x: 8 }}
                >
                  <div className={`shrink-0 p-2.5 rounded-lg bg-gradient-to-br ${item.color} text-white`}>
                    {item.icon}
                  </div>
                  <p
                    className="text-gray-300 text-sm md:text-base group-hover:text-white transition-colors"
                    style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                  >
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="relative h-[500px] md:h-[690px] rounded-3xl overflow-hidden"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <div className="relative h-full rounded-3xl overflow-hidden glass-card p-1">
              <div className="relative h-full rounded-2xl overflow-hidden">
                <Image
                  src="/images/trip.jpg"
                  alt="NextStepZ Journey"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              </div>
            </div>

            <motion.div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              animate={{
                boxShadow: [
                  '0 0 30px rgba(34, 211, 238, 0.2)',
                  '0 0 60px rgba(34, 211, 238, 0.4)',
                  '0 0 30px rgba(34, 211, 238, 0.2)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </div>

      <div className="section-divider mt-24" />
    </section>
  );
}
