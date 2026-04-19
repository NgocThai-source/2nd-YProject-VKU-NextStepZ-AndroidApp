'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Check, AlertCircle } from 'lucide-react';
import { NEWSLETTER_CONFIG, ANIMATION_TIMINGS } from './footer.config';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setStatus('error');
      setMessage(NEWSLETTER_CONFIG.messages.empty);
      return;
    }

    if (!validateEmail(email)) {
      setStatus('error');
      setMessage(NEWSLETTER_CONFIG.messages.invalid);
      return;
    }

    setStatus('loading');

    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setMessage(NEWSLETTER_CONFIG.messages.success);
      setEmail('');

      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: ANIMATION_TIMINGS.medium }}
      className="space-y-4"
    >
      <div>
        <h3 className="text-lg font-semibold text-white mb-2 tracking-tight" style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}>
          {NEWSLETTER_CONFIG.title}
        </h3>
        <p className="text-white/60 text-sm" style={{ fontFamily: "'Poppins Regular', sans-serif" }}>
          {NEWSLETTER_CONFIG.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative group">
          <div className="absolute inset-0 bg-linear-to-r from-cyan-400/20 to-blue-500/20 rounded-xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-cyan-400/50 transition-all duration-300 hover:border-white/20">
            <Mail className="w-5 h-5 text-white/40 mr-3" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={NEWSLETTER_CONFIG.placeholder}
              className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-sm"
              style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              disabled={status === 'loading'}
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          style={{
            background:
              status === 'success'
                ? 'linear-gradient(135deg, rgb(34, 197, 94) 0%, rgb(22, 163, 74) 100%)'
                : 'linear-gradient(135deg, rgb(34, 211, 238) 0%, rgb(59, 130, 246) 100%)',
            fontFamily: "'Exo 2 Medium', sans-serif"
          }}
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center justify-center gap-2">
            {status === 'loading' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
            )}
            {status === 'success' && <Check className="w-4 h-4" />}
            <span>
              {status === 'loading'
                ? NEWSLETTER_CONFIG.messages.loading
                : status === 'success'
                  ? 'Đã đăng ký!'
                  : NEWSLETTER_CONFIG.buttonText}
            </span>
          </div>
        </motion.button>

        {/* Status Message */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: message ? 1 : 0,
            y: message ? 0 : -10,
          }}
          transition={{ duration: ANIMATION_TIMINGS.short }}
          className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${
            status === 'success'
              ? 'bg-green-500/10 text-green-400'
              : 'bg-red-500/10 text-red-400'
          }`}
          style={{ fontFamily: "'Poppins Regular', sans-serif" }}
        >
          {status === 'success' ? (
            <Check className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {message}
        </motion.div>
      </form>
    </motion.div>
  );
}
