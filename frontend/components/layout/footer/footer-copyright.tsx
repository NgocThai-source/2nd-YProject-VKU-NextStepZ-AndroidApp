'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

export function FooterCopyright() {
  const currentYear = new Date().getFullYear();

  // Contact information - Replace with your actual details
  const contactInfo = {
    phone: '+84 (0) 338 445 343',
    email: 'nguyenngocthai.nqu@gmail.com',
    address: '470 Trần Đại Nghĩa, P. Ngũ Hành Sơn, Tp. Đà Nẵng',
  };

  const contactItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      {/* Gradient border with smooth effect */}
      <div className="h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />

      {/* Copyright and Contact Information Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 py-4">
        {/* Copyright - Left Side */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="text-white/50 text-sm font-light whitespace-nowrap"
          style={{ fontFamily: "'Poppins Regular', sans-serif" }}
        >
          © {currentYear} NextStepZ. All rights reserved.
        </motion.p>

        {/* Contact Information - Right Side */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col md:flex-row gap-8 md:gap-6"
        >
          {/* Phone */}
          <motion.div
            variants={contactItemVariants}
            className="flex items-center gap-2 group"
          >
            <div className="p-1.5 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-all duration-300">
              <Phone className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex flex-col">
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>Điện thoại</p>
              <a
                href={`tel:${contactInfo.phone}`}
                className="text-white/70 hover:text-cyan-400 transition-colors duration-300 font-medium text-sm"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              >
                {contactInfo.phone}
              </a>
            </div>
          </motion.div>

          {/* Email */}
          <motion.div
            variants={contactItemVariants}
            className="flex items-center gap-2 group"
          >
            <div className="p-1.5 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-all duration-300">
              <Mail className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex flex-col">
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>Email</p>
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-white/70 hover:text-cyan-400 transition-colors duration-300 font-medium text-sm"
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              >
                {contactInfo.email}
              </a>
            </div>
          </motion.div>

          {/* Address */}
          <motion.div
            variants={contactItemVariants}
            className="flex items-center gap-2 group"
          >
            <div className="p-1.5 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-all duration-300">
              <MapPin className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex flex-col">
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider" style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}>Địa chỉ</p>
              <p className="text-white/70 font-medium text-sm" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>{contactInfo.address}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
