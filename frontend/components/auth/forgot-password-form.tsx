'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CheckCircle, AlertCircle, Loader, Eye, EyeOff } from 'lucide-react';

interface ForgotPasswordFormProps {
  onToggleForm: (form: 'login' | 'register' | 'forgot') => void;
}

export function ForgotPasswordForm({ onToggleForm }: ForgotPasswordFormProps) {
  const [step, setStep] = useState<'email' | 'otp' | 'password' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [userEmail, setUserEmail] = useState(''); // Store actual email from backend
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  // Debug: Log step changes
  useEffect(() => {
    console.log('🔄 Bước điền biểu mẫu đã được thay đổi thành:', step);
  }, [step]);

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email.trim()) {
      setError('Vui lòng nhập email');
      setIsLoading(false);
      return;
    }

    try {
      console.log('📧 Gửi OTP cho:', email);
      const response = await fetch(`${API_URL}/auth/forgot-password/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: email }),
      });

      const data = await response.json();
      console.log('📌 Status:', response.status);
      console.log('📌 Success:', data.success);
      console.log('📌 Message:', data.message);
      console.log('📌 Full Response:', data);

      if (!response.ok) {
        console.warn('⚠️ Lỗi gửi OTP:', data.message);
        setError(data.message || 'Không thể gửi OTP');
        setIsLoading(false);
        return;
      }

      // Kiểm tra success flag - nếu success không phải true, user không tồn tại
      if (!data.success) {
        console.warn('⚠️ User không tồn tại');
        setError(data.message || 'Email hoặc số điện thoại không tồn tại trong hệ thống');
        setIsLoading(false);
        return;
      }

      console.log('✅ OTP gửi thành công! Chuyển sang bước nhập OTP');
      // Clear error and set up OTP step
      setError('');
      setOtpTimer(600);
      setUserEmail(data.email || email); // Store actual email from backend
      setIsLoading(false);
      // Set step last to ensure all state updates are batched
      setStep('otp');
    } catch (error) {
      console.warn('⚠️ Lỗi gửi OTP:', error);
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!otp.trim()) {
      setError('Vui lòng nhập mã OTP');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: email, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'OTP không chính xác');
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      console.log('✅ OTP xác nhận thành công!', data);
      setError('');
      setResetToken(data.resetToken);
      setIsLoading(false);
      setStep('password');
    } catch (error) {
      console.warn('⚠️ Lỗi xác nhận OTP:', error);
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError('Vui lòng nhập mật khẩu mới');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu không khớp');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resetToken,
          newPassword,
          confirmPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Không thể đặt lại mật khẩu');
        setIsLoading(false);
        return;
      }

      console.log('✅ Mật khẩu đặt lại thành công!');
      setError('');
      setIsLoading(false);
      setStep('success');
    } catch (error) {
      console.warn('⚠️ Lỗi đặt lại mật khẩu:', error);
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
      setIsLoading(false);
    }
  };

  // Timer effect for OTP
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

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      key={`forgot-form-${step}`}
    >
      {/* Back Button - Show for all steps except success */}
      {step !== 'success' && (
        <motion.button
          onClick={() => onToggleForm('login')}
          className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors text-sm font-medium mb-4"
          style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
          whileHover={{ x: -4 }}
          whileTap={{ x: -2 }}
          variants={itemVariants}
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại đăng nhập
        </motion.button>
      )}

      {/* STEP 1: Email */}
      {step === 'email' && (
        <>
          <motion.div className="space-y-2" variants={itemVariants}>
            <h1
              className="text-xl sm:text-2xl font-black bg-linear-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent"
              style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}
            >
              Đặt lại mật khẩu
            </h1>
            <p
              className="text-gray-400 text-xs sm:text-sm leading-relaxed"
              style={{ fontFamily: "'Poppins Regular', sans-serif" }}
            >
              Nhập email để nhận mã OTP
            </p>
          </motion.div>

          <motion.div className="space-y-4" variants={itemVariants}>
            {error && (
              <motion.div
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <motion.div className="space-y-2" variants={itemVariants}>
              <label
                className="text-sm font-semibold text-gray-300"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                Email hoặc Số điện thoại
              </label>
              <motion.div className="relative group">
                <Input
                  type="text"
                  placeholder="example@email.com hoặc 0912345678"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-linear-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/40 rounded-xl text-white placeholder:text-gray-400 transition-all duration-300 focus:border-cyan-400 focus:bg-linear-to-r focus:from-cyan-500/20 focus:to-purple-500/20 focus:shadow-lg focus:shadow-cyan-500/20 disabled:opacity-50"
                  style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                />
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                onClick={handleSendOtp}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -2 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : null}
                <span className="relative">
                  {isLoading ? 'Đang gửi...' : 'Gửi mã OTP'}
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}

      {/* STEP 2: OTP Verification */}
      {step === 'otp' && (
        <>
          <motion.div className="space-y-2" variants={itemVariants}>
            <h1
              className="text-xl sm:text-2xl font-black bg-linear-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent"
              style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}
            >
              Nhập mã OTP
            </h1>
            <p
              className="text-gray-400 text-xs sm:text-sm leading-relaxed"
              style={{ fontFamily: "'Poppins Regular', sans-serif" }}
            >
              Mã OTP đã được gửi về email: <span className="text-cyan-300 font-semibold">{userEmail}</span>
            </p>
          </motion.div>

          <motion.div className="space-y-4" variants={itemVariants}>
            {error && (
              <motion.div
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <motion.div className="space-y-2" variants={itemVariants}>
              <label
                className="text-sm font-semibold text-gray-300"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                Mã OTP (6 số)
              </label>
              <Input
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                disabled={isLoading}
                maxLength={6}
                className="w-full px-4 py-3 bg-linear-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/40 rounded-xl text-white placeholder:text-gray-400 text-center text-2xl tracking-widest transition-all duration-300 focus:border-cyan-400 focus:bg-linear-to-r focus:from-cyan-500/20 focus:to-purple-500/20 focus:shadow-lg focus:shadow-cyan-500/20 disabled:opacity-50"
                style={{ fontFamily: "'Courier New', monospace" }}
              />
            </motion.div>

            {otpTimer > 0 && (
              <motion.div
                className="text-center text-sm text-cyan-300 font-semibold"
                style={{ fontFamily: "'Poppins SemiBold', sans-serif" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ⏰ Hết hạn trong: {formatTime(otpTimer)}
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <motion.button
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.length !== 6}
                className="w-full px-4 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -2 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : null}
                <span className="relative">
                  {isLoading ? 'Đang xác nhận...' : 'Xác nhận OTP'}
                </span>
              </motion.button>
            </motion.div>

            <motion.button
              onClick={() => setStep('email')}
              className="w-full px-4 py-3 rounded-xl border border-cyan-400/40 text-cyan-300 hover:text-cyan-200 hover:border-cyan-400/60 font-semibold transition-all"
              style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Quay lại
            </motion.button>
          </motion.div>
        </>
      )}

      {/* STEP 3: Reset Password */}
      {step === 'password' && (
        <>
          <motion.div className="space-y-2" variants={itemVariants}>
            <h1
              className="text-xl sm:text-2xl font-black bg-linear-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent"
              style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}
            >
              Mật khẩu mới
            </h1>
            <p
              className="text-gray-400 text-xs sm:text-sm leading-relaxed"
              style={{ fontFamily: "'Poppins Regular', sans-serif" }}
            >
              Nhập mật khẩu mới của bạn
            </p>
          </motion.div>

          <motion.div className="space-y-4" variants={itemVariants}>
            {error && (
              <motion.div
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ fontFamily: "'Poppins Regular', sans-serif" }}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <motion.div className="space-y-2" variants={itemVariants}>
              <label
                className="text-sm font-semibold text-gray-300"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                Mật khẩu mới
              </label>
              <motion.div className="relative group">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-linear-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/40 rounded-xl text-white placeholder:text-gray-400 pr-12 transition-all duration-300 focus:border-cyan-400 focus:bg-linear-to-r focus:from-cyan-500/20 focus:to-purple-500/20 focus:shadow-lg focus:shadow-cyan-500/20 disabled:opacity-50"
                  style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                />
                <motion.button
                  type="button"
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-300 transition-colors disabled:opacity-50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div className="space-y-2" variants={itemVariants}>
              <label
                className="text-sm font-semibold text-gray-300"
                style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
              >
                Xác nhận mật khẩu
              </label>
              <motion.div className="relative group">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-linear-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/40 rounded-xl text-white placeholder:text-gray-400 pr-12 transition-all duration-300 focus:border-cyan-400 focus:bg-linear-to-r focus:from-cyan-500/20 focus:to-purple-500/20 focus:shadow-lg focus:shadow-cyan-500/20 disabled:opacity-50"
                  style={{ fontFamily: "'Poppins Regular', sans-serif" }}
                />
                <motion.button
                  type="button"
                  onMouseDown={() => setShowConfirmPassword(true)}
                  onMouseUp={() => setShowConfirmPassword(false)}
                  onMouseLeave={() => setShowConfirmPassword(false)}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-300 transition-colors disabled:opacity-50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                onClick={handleResetPassword}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
                whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -2 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : null}
                <span className="relative">
                  {isLoading ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}

      {/* STEP 4: Success */}
      {step === 'success' && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20,
              delay: 0.1,
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: 1,
                ease: 'easeInOut',
              }}
            >
              <CheckCircle className="w-16 h-16 text-green-400" />
            </motion.div>
          </motion.div>

          <motion.div
            className="space-y-3 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2
              className="text-lg sm:text-xl font-black bg-linear-to-r from-green-300 to-cyan-300 bg-clip-text text-transparent"
              style={{ fontFamily: "'Exo 2 ExtraBold', sans-serif" }}
            >
              Thành công!
            </h2>
            <p
              className="text-gray-400 text-sm leading-relaxed"
              style={{ fontFamily: "'Poppins Regular', sans-serif" }}
            >
              Mật khẩu của bạn đã được đặt lại thành công.
              <br />
              Bạn có thể đăng nhập bằng mật khẩu mới.
            </p>
          </motion.div>

          <motion.button
            onClick={() => onToggleForm('login')}
            className="w-full px-4 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold transition-all duration-300"
            style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Đăng nhập
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
