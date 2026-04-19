'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Mail, Github, Sparkles, Quote } from 'lucide-react';
import Image from 'next/image';

interface Founder {
  id: number;
  name: string;
  university: string;
  social: {
    facebook?: string;
    email?: string;
    github?: string;
  };
  image: string;
}

const founders: Founder[] = [
  {
    id: 1,
    name: 'Nguyễn Ngọc Thái',
    university: 'Trường ĐH CNTT & TT Việt - Hàn (VKU), Đại học Đà Nẵng',
    social: {
      facebook: 'https://www.facebook.com/2nthais/',
      email: 'nguyenngocthai.nqu@gmail.com',
      github: 'https://github.com/NgocThai-source',
    },
    image: '/images/picnv1.jpg',
  },
  {
    id: 2,
    name: 'Lê Đức Hải',
    university: 'Trường ĐH CNTT & TT Việt - Hàn (VKU), Đại học Đà Nẵng',
    social: {
      facebook: 'https://facebook.com',
      email: 'tech@nextstepz.com',
      github: 'https://github.com',
    },
    image: '/images/founders/founder-2.jpg',
  },
];

export default function FoundersSection() {
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
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section className="relative w-full py-24 md:py-36 px-4 md:px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -right-48 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 60%)',
            filter: 'blur(100px)',
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 -left-48 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, transparent 60%)',
            filter: 'blur(100px)',
          }}
          animate={{
            x: [0, -100, 0],
            y: [0, -60, 0],
          }}
          transition={{ duration: 16, repeat: Infinity, delay: 1 }}
        />

        <motion.div
          className="absolute inset-0 opacity-[0.02]"
          animate={{ backgroundPosition: ['0px 0px', '100px 100px'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          style={{
            backgroundImage: 'linear-gradient(45deg, #22d3ee 1px, transparent 1px), linear-gradient(-45deg, #22d3ee 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-400/30">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>
                Đội Ngũ Sáng Lập
              </span>
            </div>
          </motion.div>

          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
            style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}
          >
            <span className="gradient-text-premium">
              Những Người Đứng Sau
            </span>
            <br />
            <span className="text-white">NextStepZ</span>
          </h2>

          <p
            className="text-gray-400 text-base md:text-lg max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
          >
            Giữa sự bấp bênh của thị trường và nỗi lo thất nghiệp, chúng mình muốn tạo nên một nền tảng thật sự hỗ trợ sinh viên — giúp các bạn tìm được hướng đi phù hợp.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {founders.map((founder, index) => (
            <motion.div
              key={founder.id}
              variants={itemVariants}
              className="group"
              whileHover={{ y: -10 }}
            >
              <div className="relative h-full">
                <motion.div
                  className={`absolute -inset-0.5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 ${index === 0
                      ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30'
                      : 'bg-gradient-to-r from-purple-500/30 to-pink-500/30'
                    }`}
                />

                <div className={`relative h-full glass-card-strong rounded-3xl p-8 md:p-10 border transition-all duration-500 ${index === 0
                    ? 'border-cyan-400/20 group-hover:border-cyan-400/50'
                    : 'border-purple-400/20 group-hover:border-purple-400/50'
                  }`}>
                  <motion.div
                    className="mb-8 relative flex justify-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <div className={`relative w-40 h-48 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${index === 0 ? 'border-cyan-400/30 group-hover:border-cyan-400' : 'border-purple-400/30 group-hover:border-purple-400'
                      }`}>
                      {index === 0 && founder.image ? (
                        <Image
                          src={founder.image}
                          alt={founder.name}
                          fill
                          className="object-cover"
                          priority
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center text-white text-4xl font-bold bg-gradient-to-br ${index === 0
                            ? 'from-cyan-500 to-blue-600'
                            : 'from-purple-500 to-pink-600'
                          }`}>
                          {founder.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </motion.div>

                  <div className="text-center space-y-3 mb-6">
                    <h3
                      className={`text-2xl md:text-3xl font-bold ${index === 0 ? 'text-cyan-300' : 'text-purple-300'
                        }`}
                      style={{ fontFamily: "'Poppins ExtraBold', sans-serif" }}
                    >
                      {founder.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <span className={`w-1.5 h-1.5 rounded-full ${index === 0 ? 'bg-cyan-400' : 'bg-purple-400'}`} />
                      <p className="text-xs md:text-sm" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
                        {founder.university}
                      </p>
                    </div>
                  </div>

                  <motion.div
                    className="flex items-center justify-center gap-4 pt-6 border-t border-white/10"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    {founder.social.facebook && (
                      <motion.a
                        href={founder.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 rounded-xl border transition-all duration-300 ${index === 0
                            ? 'border-cyan-400/20 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20'
                            : 'border-purple-400/20 text-purple-400 hover:bg-purple-500/20 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20'
                          }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Facebook className="w-5 h-5" />
                      </motion.a>
                    )}
                    {founder.social.github && (
                      <motion.a
                        href={founder.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 rounded-xl border transition-all duration-300 ${index === 0
                            ? 'border-cyan-400/20 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20'
                            : 'border-purple-400/20 text-purple-400 hover:bg-purple-500/20 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20'
                          }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Github className="w-5 h-5" />
                      </motion.a>
                    )}
                    {founder.social.email && (
                      <motion.a
                        href={`mailto:${founder.social.email}`}
                        className={`p-3 rounded-xl border transition-all duration-300 ${index === 0
                            ? 'border-cyan-400/20 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20'
                            : 'border-purple-400/20 text-purple-400 hover:bg-purple-500/20 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20'
                          }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Mail className="w-5 h-5" />
                      </motion.a>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-20 md:mt-28"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <div className="relative glass-card-strong rounded-3xl p-8 md:p-12 border border-cyan-400/20 overflow-hidden">
            <motion.div
              className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-xl opacity-50"
            />

            <div className="relative text-center space-y-4">
              <Quote className="w-10 h-10 text-cyan-400/50 mx-auto mb-4" />
              <p
                className="text-lg md:text-2xl text-gray-300 italic leading-relaxed max-w-4xl mx-auto"
                style={{ fontFamily: "'Poppins Medium Italic', sans-serif" }}
              >
                &ldquo;Chúng mình tin rằng mỗi sinh viên đều sở hữu một tiềm năng lớn hơn những gì họ nghĩ. NextStepZ được tạo ra để giúp bạn khám phá thế mạnh của mình, phát triển kỹ năng và từng bước biến ước mơ nghề nghiệp thành hiện thực.&rdquo;
              </p>
              <p
                className="text-sm md:text-base text-cyan-400 font-semibold"
                style={{ fontFamily: "'Poppins SemiBold', sans-serif" }}
              >
                — Nguyễn Ngọc Thái
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
