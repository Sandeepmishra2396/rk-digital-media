import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Music,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    authMode,
    setAuthMode,
    closeAuthModal,
    login,
    signup,
    loginWithGoogle,
    requestPasswordReset,
    resetPassword,
  } = useAuth();

  // Common Form States
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sign In States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up States
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupRole, setSignupRole] = useState('Independent Artist / Singer');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Forgot Password States
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState(1); // 1: enter email, 2: enter otp & new password
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Google Modal Custom Email Prompt State
  const [showGooglePrompt, setShowGooglePrompt] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');

  if (!isAuthModalOpen) return null;

  const resetAllFields = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(false);
  };

  const handleTabChange = (mode) => {
    resetAllFields();
    setAuthMode(mode);
    if (mode === 'forgot') {
      setForgotStep(1);
    }
  };

  // 1. Submit Sign In
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginEmail || !loginPassword) {
      setErrorMessage('Please enter both Email and Password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = login(loginEmail, loginPassword);
      setLoading(false);
      if (!res.success) {
        setErrorMessage(res.error);
      }
    }, 600);
  };

  // Demo 1-Click Login
  const handleQuickDemoLogin = () => {
    setLoginEmail('artist@rkdigitalmedia.in');
    setLoginPassword('password123');
    setLoading(true);
    setTimeout(() => {
      login('artist@rkdigitalmedia.in', 'password123');
      setLoading(false);
    }, 400);
  };

  // 2. Submit Sign Up
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!signupName.trim()) {
      setErrorMessage('Please enter your Full / Artist Name.');
      return;
    }
    if (!signupEmail.trim()) {
      setErrorMessage('Please enter your valid Email address.');
      return;
    }
    if (signupPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms of Service & Music Distribution Policy.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = signup({
        name: signupName,
        email: signupEmail,
        phone: signupPhone,
        role: signupRole,
        password: signupPassword,
      });
      setLoading(false);
      if (!res.success) {
        setErrorMessage(res.error);
      }
    }, 700);
  };

  // 3. Forgot Password Flow
  const handleRequestOtp = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!forgotEmail.trim()) {
      setErrorMessage('Please enter your registered Email address.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = requestPasswordReset(forgotEmail);
      setLoading(false);
      if (!res.success) {
        setErrorMessage(res.error);
      } else {
        setGeneratedOtp(res.otp);
        setEnteredOtp(res.otp); // Pre-fill for convenience
        setForgotStep(2);
        setSuccessMessage(`Verification code sent to ${forgotEmail}! (Code: ${res.otp})`);
      }
    }, 600);
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (enteredOtp !== generatedOtp) {
      setErrorMessage('Invalid verification OTP code. Please enter the correct code.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = resetPassword(forgotEmail, newPassword);
      setLoading(false);
      if (!res.success) {
        setErrorMessage(res.error);
      } else {
        setSuccessMessage('Password updated successfully! Redirecting to Sign In...');
        setTimeout(() => {
          setLoginEmail(forgotEmail);
          setLoginPassword(newPassword);
          setAuthMode('signin');
          setSuccessMessage('You can now log in with your new password.');
        }, 1200);
      }
    }, 600);
  };

  // 4. Google One-Tap / Custom Email Login
  const handleGoogleLogin = (customEmail = null, customName = null) => {
    setLoading(true);
    setTimeout(() => {
      loginWithGoogle(customEmail, customName);
      setLoading(false);
      setShowGooglePrompt(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
      {/* Dark Blur Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
        onClick={closeAuthModal}
      />

      {/* Modal Dialog Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden my-8 z-10"
        style={{ background: 'linear-gradient(145deg, #0d1224 0%, #080b14 100%)' }}
      >
        {/* Top Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold text-base tracking-wide">RK DIGITAL MEDIA</span>
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                  Portal
                </span>
              </div>
              <p className="text-xs text-gray-400">Music Distribution & Artist Dashboard</p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 bg-black/30 p-1.5 mx-6 mt-4 rounded-2xl">
          <button
            onClick={() => handleTabChange('signin')}
            className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all ${
              authMode === 'signin'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => handleTabChange('signup')}
            className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all ${
              authMode === 'signup'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => handleTabChange('forgot')}
            className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all ${
              authMode === 'forgot'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Forgot Password
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 pt-4 max-h-[80vh] overflow-y-auto">
          {/* Error Message Alert */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-800/80 text-red-200 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Success Message Alert */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-200 text-xs flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMessage}</span>
            </motion.div>
          )}

          {/* Google Quick Sign-In Option (Visible on Sign In & Sign Up) */}
          {(authMode === 'signin' || authMode === 'signup') && (
            <div className="mb-5">
              <button
                type="button"
                onClick={() => handleGoogleLogin()}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-all duration-200 group shadow-sm hover:border-white/40"
              >
                {/* Official Google G Icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12c0 2.06.45 3.84 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google / Gmail</span>
              </button>

              <div className="flex items-center justify-between mt-2">
                <button
                  type="button"
                  onClick={() => setShowGooglePrompt(!showGooglePrompt)}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors mx-auto"
                >
                  {showGooglePrompt ? 'Cancel custom Gmail' : 'Use a specific Gmail ID? Click here'}
                </button>
              </div>

              {/* Optional Custom Gmail Input box */}
              {showGooglePrompt && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10 space-y-2.5"
                >
                  <p className="text-xs text-gray-300 font-medium">Enter your Google / Gmail Account:</p>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={googleNameInput}
                    onChange={(e) => setGoogleNameInput(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="email"
                    placeholder="yourname@gmail.com"
                    value={googleEmailInput}
                    onChange={(e) => setGoogleEmailInput(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleGoogleLogin(
                        googleEmailInput || 'artist@gmail.com',
                        googleNameInput || 'Music Creator'
                      )
                    }
                    className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                  >
                    Confirm & Sign In with this Gmail
                  </button>
                </motion.div>
              )}

              {/* Divider */}
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-white/10 w-full" />
                <span className="bg-[#0b0f1e] px-3 text-xs text-gray-500 uppercase tracking-wider">
                  or with email
                </span>
                <div className="border-t border-white/10 w-full" />
              </div>
            </div>
          )}

          {/* ==================== TAB 1: SIGN IN ==================== */}
          {authMode === 'signin' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-300">Password</label>
                  <button
                    type="button"
                    onClick={() => handleTabChange('forgot')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-black/40 border border-white/15 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-700 bg-black/40 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Remember me on this device</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick Demo Login Pill */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full py-2 px-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>One-Click Demo Artist Login (Testing)</span>
                </button>
              </div>

              <p className="text-center text-xs text-gray-400 pt-2">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleTabChange('signup')}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                >
                  Sign Up Now
                </button>
              </p>
            </form>
          )}

          {/* ==================== TAB 2: SIGN UP ==================== */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Full Name / Artist / Label Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Raushan Pathak / Mithila Music"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Mobile / WhatsApp Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="e.g. 7631350084"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Account Type
                </label>
                <select
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/40 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="Independent Artist / Singer" className="bg-navy-900 text-white">
                    Independent Artist / Singer
                  </option>
                  <option value="Record Label / Music Company" className="bg-navy-900 text-white">
                    Record Label / Music Company
                  </option>
                  <option value="Music Producer / Composer" className="bg-navy-900 text-white">
                    Music Producer / Composer
                  </option>
                  <option value="YouTube Channel Manager / Network" className="bg-navy-900 text-white">
                    YouTube Channel Manager / Network
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="At least 6 chars"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Confirm</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter password"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1 text-xs text-gray-400">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-gray-700 bg-black/40 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="agreeTerms" className="cursor-pointer">
                  I agree to RK DIGITAL MEDIA distribution terms, 100% master ownership retention & privacy policies.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 pt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Artist Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 pt-1">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleTabChange('signin')}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                >
                  Sign In
                </button>
              </p>
            </form>
          )}

          {/* ==================== TAB 3: FORGOT PASSWORD ==================== */}
          {authMode === 'forgot' && (
            <div>
              {forgotStep === 1 ? (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto mb-2">
                      <KeyRound className="w-6 h-6" />
                    </div>
                    <h3 className="text-white font-bold text-sm">Reset Your Password</h3>
                    <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                      Enter your registered email address and we'll send you an instant verification code to reset your password.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Registered Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. artist@rkdigitalmedia.in"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Send Verification Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => handleTabChange('signin')}
                      className="text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      ← Back to Sign In
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-center">
                    <p className="text-xs text-indigo-300 font-semibold">Verification Code Generated:</p>
                    <p className="text-xl font-mono font-black text-white tracking-widest my-1">
                      {generatedOtp}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Code sent to <span className="text-white">{forgotEmail}</span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Enter 6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      className="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-center text-lg font-mono font-bold text-white tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Re-enter new password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Update & Set New Password</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                    <button
                      type="button"
                      onClick={() => setForgotStep(1)}
                      className="hover:text-white"
                    >
                      Resend Code
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTabChange('signin')}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-black/40 border-t border-white/10 text-center">
          <p className="text-[11px] text-gray-500">
            RK DIGITAL MEDIA • Secure Artist & Label Distribution Gateway • 256-bit Encrypted
          </p>
        </div>
      </motion.div>
    </div>
  );
}
