'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, Mail, CheckCircle, AlertCircle, Loader, Eye, EyeOff, Shield, Key } from 'lucide-react';
import { Input } from '@/components/ui/input';

type PasswordChangeStep = 'idle' | 'otp' | 'password' | 'success';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string; firstName?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<PasswordChangeStep>('idle');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');

    if (!storedUser || !token) {
      router.push('/auth');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch {
      router.push('/auth');
    }
  }, [router]);

  // OTP Timer
  useEffect(() => {
    if (otpTimer > 0 && step === 'otp') {
      const timer = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [otpTimer, step]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/change-password/send-otp`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Không thể gửi OTP');
        setIsLoading(false);
        return;
      }

      setMaskedEmail(data.email || '');
      setOtpTimer(600); // 10 minutes
      setStep('otp');
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Vui lòng nhập đủ 6 số OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/change-password/verify-otp`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'OTP không chính xác');
        setIsLoading(false);
        return;
      }

      setResetToken(data.resetToken);
      setStep('password');
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Change Password
  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Vui lòng nhập mật khẩu mới');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/change-password/reset`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          resetToken,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Không thể thay đổi mật khẩu');
        setIsLoading(false);
        return;
      }

      setStep('success');
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to initial state
  const handleReset = () => {
    setStep('idle');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setResetToken('');
    setError('');
    setOtpTimer(0);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Quay lại</span>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 mb-4">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent mb-2">
            Cài đặt tài khoản
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Quản lý bảo mật tài khoản của bạn
          </p>
        </motion.div>

        {/* Password Change Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-2xl border border-cyan-400/20 overflow-hidden shadow-xl shadow-cyan-500/5"
        >
          {/* Card Header */}
          <div className="px-6 py-5 border-b border-cyan-400/10 bg-gradient-to-r from-cyan-500/5 to-purple-500/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-400/20">
                <Key className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Đổi mật khẩu</h2>
                <p className="text-sm text-gray-400">Bảo vệ tài khoản với mật khẩu mới</p>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* IDLE STATE - Show request OTP button */}
              {step === 'idle' && (
                <motion.div
                  key="idle"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <motion.div variants={itemVariants} className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <Mail className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-sm text-gray-400">Email đăng ký</p>
                      <p className="text-white font-medium">{user.email || 'Không có email'}</p>
                    </div>
                  </motion.div>

                  <motion.p variants={itemVariants} className="text-sm text-gray-400 leading-relaxed">
                    Để thay đổi mật khẩu, chúng tôi sẽ gửi mã OTP đến email của bạn để xác minh danh tính.
                  </motion.p>

                  {error && (
                    <motion.div
                      className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  <motion.button
                    variants={itemVariants}
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  >
                    {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    {isLoading ? 'Đang gửi...' : 'Gửi mã OTP'}
                  </motion.button>
                </motion.div>
              )}

              {/* OTP STEP */}
              {step === 'otp' && (
                <motion.div
                  key="otp"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <motion.div variants={itemVariants} className="text-center mb-2">
                    <p className="text-gray-400 text-sm">
                      Mã OTP đã được gửi đến: <span className="text-cyan-300 font-semibold">{maskedEmail}</span>
                    </p>
                  </motion.div>

                  {error && (
                    <motion.div
                      className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Mã OTP (6 số)</label>
                    <Input
                      type="text"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      disabled={isLoading}
                      maxLength={6}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-400/30 rounded-xl text-white placeholder:text-gray-500 text-center text-2xl tracking-widest focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                      style={{ fontFamily: "'Courier New', monospace" }}
                    />
                  </motion.div>

                  {otpTimer > 0 && (
                    <motion.div
                      variants={itemVariants}
                      className="text-center text-sm text-cyan-300 font-medium"
                    >
                      ⏰ Hết hạn trong: {formatTime(otpTimer)}
                    </motion.div>
                  )}

                  <motion.div variants={itemVariants} className="flex gap-3">
                    <motion.button
                      onClick={handleReset}
                      className="flex-1 px-4 py-3 rounded-xl border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/10 font-medium transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Quay lại
                    </motion.button>
                    <motion.button
                      onClick={handleVerifyOtp}
                      disabled={isLoading || otp.length !== 6}
                      className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      whileHover={{ scale: isLoading ? 1 : 1.02 }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    >
                      {isLoading && <Loader className="w-4 h-4 animate-spin" />}
                      Xác nhận
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}

              {/* PASSWORD STEP */}
              {step === 'password' && (
                <motion.div
                  key="password"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <motion.div variants={itemVariants} className="text-center mb-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 border border-green-400/30 mb-2">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <p className="text-green-400 text-sm font-medium">OTP xác nhận thành công!</p>
                  </motion.div>

                  {error && (
                    <motion.div
                      className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Mật khẩu mới</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={isLoading}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-400/30 rounded-xl text-white placeholder:text-gray-500 pr-12 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Xác nhận mật khẩu</label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-400/30 rounded-xl text-white placeholder:text-gray-500 pr-12 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-300 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </motion.div>

                  <motion.button
                    variants={itemVariants}
                    onClick={handleChangePassword}
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  >
                    {isLoading && <Loader className="w-4 h-4 animate-spin" />}
                    {isLoading ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                  </motion.button>
                </motion.div>
              )}

              {/* SUCCESS STEP */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 space-y-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-400/30"
                  >
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </motion.div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Thành công!</h3>
                    <p className="text-gray-400 text-sm">Mật khẩu của bạn đã được thay đổi thành công.</p>
                  </div>

                  <motion.button
                    onClick={handleReset}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold transition-all shadow-lg shadow-cyan-500/20"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Hoàn tất
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Security Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-4 rounded-xl bg-slate-900/50 border border-cyan-400/10"
        >
          <h3 className="text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Mẹo bảo mật
          </h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Sử dụng mật khẩu ít nhất 8 ký tự với chữ hoa, chữ thường và số</li>
            <li>• Không sử dụng mật khẩu giống với các tài khoản khác</li>
            <li>• Thay đổi mật khẩu định kỳ để bảo vệ tài khoản</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
