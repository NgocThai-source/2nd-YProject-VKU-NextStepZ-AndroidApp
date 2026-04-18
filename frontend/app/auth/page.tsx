'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import { Compass, Briefcase, Users } from 'lucide-react';
import { LoginForm } from '@/components/auth/login-form';
import { RegisterForm } from '@/components/auth/register-form';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export default function AuthPage() {
  const [activeForm, setActiveForm] = useState<'login' | 'register' | 'forgot'>('login');

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background with Animated Gradients */}
      <div className="absolute inset-0 z-0">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-linear-to-b from-slate-900 via-blue-900 to-slate-900" />

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-60 h-60 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15"
          animate={{
            x: [0, 30, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      {/* Content Container */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-[55%_45%] gap-4 md:gap-8 lg:gap-12 items-center justify-center relative z-10 px-2 sm:px-4">
        {/* Logo and Welcome Section */}
        <motion.div
          className="hidden md:flex flex-col items-start space-y-2"
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.1,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          {/* Logo */}
          <motion.div
            className="flex flex-row items-start gap-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.34, 1.56, 0.64, 1]
            }}
            style={{ perspective: 1000 }}
          >
            <div className="relative w-130 h-30 shrink-0">
              <Image
                src="/images/logofull1-transprent.png"
                alt="NextStepZ"
                fill
                sizes="(max-width: 768px) 150px, 200px"
                className="object-contain drop-shadow-lg"
                priority
                quality={100}
                unoptimized
              />
            </div>
          </motion.div>

          {/* Welcome Text */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 0.9,
              delay: 0.35,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <div className="space-y-3">
              <h1
                className="text-5xl lg:text-4xl font-black bg-linear-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent leading-tight"
                style={{ fontFamily: "'Poppins ExtraBold', sans-serif" }}
              >
                Khởi động hành trình của bạn
              </h1>
              <p
                className="text-xl text-gray-300 max-w-lg"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              >
                Bạn là một phần của cộng đồng <span className="text-cyan-300 font-semibold">NextStepZ</span> — nơi mỗi bước đi đều mang ý nghĩa.
              </p>
            </div>

            {/* Feature Pills */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.6,
                staggerChildren: 0.1,
              }}
            >
              {[
                { icon: <Compass className="w-5 h-5" />, text: 'Định hướng sự nghiệp' },
                { icon: <Briefcase className="w-5 h-5" />, text: 'Xây dựng hồ sơ cá chuyên nghiệp' },
                { icon: <Users className="w-5 h-5" />, text: 'Kết nối cộng đồng' },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center gap-3 text-gray-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.6 + idx * 0.1,
                  }}
                >
                  <span className="text-cyan-300">{feature.icon}</span>
                  <span style={{ fontFamily: "'Exo 2 Regular', sans-serif" }}>{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Bottom Quote */}
          <motion.div
            className="pt-6 border-t border-cyan-400/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 1,
            }}
          >
            <p
              className="text-lg text-gray-300 italic leading-relaxed max-w-lg"
              style={{ fontFamily: "'Poppins Medium Italic', sans-serif" }}
            >
              &quot;Mỗi bước tiến của bạn hôm nay sẽ mở ra những cánh cửa mới cho ngày mai.&quot;
            </p>
          </motion.div>
        </motion.div>

        {/* Auth Forms Container */}
        <motion.div
          className="w-full max-w-md sm:max-w-lg md:max-w-md mx-auto px-2 sm:px-4 md:px-0"
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.15,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          {/* Premium Glassmorphism Form Card */}
          <motion.div
            className="relative rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              ease: [0.34, 1.56, 0.64, 1]
            }}
          >
            {/* Background layers */}
            <div className="absolute inset-0 bg-linear-to-br from-cyan-500/20 via-blue-500/15 to-purple-500/20 backdrop-blur-xl" />
            <div className="absolute inset-0 border border-cyan-400/30" style={{ borderRadius: '1.5rem' }} />

            {/* Gradient glow effect on hover */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.1), transparent)',
                borderRadius: '1.5rem',
              }}
              whileHover={{ opacity: 0.1 }}
              transition={{ duration: 0.3 }}
            />

            {/* Content */}
            <div className="relative p-4 sm:p-6 md:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeForm}
                  initial={{ opacity: 0, x: activeForm === 'login' ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: activeForm === 'login' ? 30 : -30 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                    duration: 0.5
                  }}
                >
                  {activeForm === 'login' && (
                    <LoginForm onToggleForm={(form) => setActiveForm(form)} />
                  )}
                  {activeForm === 'register' && (
                    <RegisterForm onToggleForm={(form) => setActiveForm(form)} />
                  )}
                  {activeForm === 'forgot' && (
                    <ForgotPasswordForm onToggleForm={(form) => setActiveForm(form)} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
