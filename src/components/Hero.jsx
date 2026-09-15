import { motion } from 'framer-motion';
import { ArrowRight, Music, Play, Star, ChevronDown, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const floatingCards = [
  { icon: '🎵', label: 'Spotify', sub: 'Distribution Active', color: '#1DB954', delay: 0 },
  { icon: '🍎', label: 'Apple Music', sub: 'Ready to Deliver', color: '#FC3C44', delay: 1.5 },
  { icon: '▶️', label: 'YouTube Music', sub: 'Content ID Active', color: '#FF0000', delay: 0.8 },
];

const trustItems = [
  { icon: '🛡️', label: 'Your Rights Protected', sub: 'Full ownership' },
  { icon: '⚡', label: 'Fast Distribution', sub: 'Professional process' },
  { icon: '🎧', label: '24/7 Support', sub: 'Always available' },
];

const barHeights = [55, 75, 40, 90, 65, 100, 50];

export default function Hero() {
  const { user, openAuthModal, openDashboard } = useAuth();

  const scrollToSection = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #050813 0%, #0a0e1a 45%, #110d2e 100%)' }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Orbs */}
        <div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(circle, #9333ea, transparent)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl opacity-10 -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-sm font-medium text-indigo-300">
                India's Growing Music Distribution Network
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6"
            >
              Your Music.{' '}
              <span
                className="block"
                style={{
                  background: 'linear-gradient(90deg, #818cf8, #a855f7, #60a5fa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Everywhere It
              </span>
              <span className="text-white">Belongs.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-gray-400 text-lg md:text-xl leading-relaxed mb-8 max-w-xl"
            >
              <strong className="text-white">RK DIGITAL MEDIA</strong> helps artists, singers,
              producers, and labels distribute their music across major digital platforms and reach
              listeners worldwide — from Spotify to JioSaavn, from YouTube to Apple Music.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <button
                onClick={() => (user ? openDashboard() : openAuthModal('signup'))}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-xl hover:shadow-indigo-500/30 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 text-base"
              >
                <span>{user ? 'Open Artist Dashboard' : 'Distribute Your Music'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollToSection('#platforms')}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/5 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/10 hover:border-indigo-400 transition-all duration-300 text-base"
              >
                <Music className="w-5 h-5 text-indigo-400" />
                Explore Platforms
              </button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="grid grid-cols-3 gap-3"
            >
              {trustItems.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-1 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition-colors"
                >
                  <span className="text-xl">{item.icon}</span>
                  <p className="text-white text-xs font-semibold leading-tight">{item.label}</p>
                  <p className="text-gray-500 text-xs">{item.sub}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Dashboard Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Main Dashboard Card */}
            <div className="relative">
              <div
                className="rounded-2xl p-5 border border-white/10 shadow-2xl"
                style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}
              >
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-400 text-xs font-medium">Distribution Dashboard</span>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                    <p className="text-gray-400 text-xs mb-1">Network Channels</p>
                    <p className="text-white font-bold text-xl">71+</p>
                    <p className="text-indigo-400 text-xs">↑ Growing</p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <p className="text-gray-400 text-xs mb-1">Platforms</p>
                    <p className="text-white font-bold text-xl">20+</p>
                    <p className="text-purple-400 text-xs">Global & Indian</p>
                  </div>
                </div>

                {/* Chart */}
                <div className="mb-3">
                  <p className="text-gray-500 text-xs mb-2">Distribution Activity</p>
                  <div className="flex items-end gap-1.5 h-20">
                    {barHeights.map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.08, ease: 'easeOut' }}
                        className="flex-1 rounded-t-sm"
                        style={{
                          background: i === 5
                            ? 'linear-gradient(to top, #6366f1, #a855f7)'
                            : 'rgba(99,102,241,0.3)',
                          height: `${h}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Platforms row */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <span className="text-gray-500 text-xs">Active on:</span>
                  <div className="flex gap-1.5">
                    {['🎵', '🍎', '▶️', '🎤'].map((emoji, i) => (
                      <span
                        key={i}
                        className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-xs"
                      >
                        {emoji}
                      </span>
                    ))}
                    <span className="text-gray-500 text-xs self-center ml-1">+16 more</span>
                  </div>
                </div>
              </div>

              {/* Floating Platform Cards */}
              {floatingCards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 + i * 0.2 }}
                  className="absolute flex items-center gap-2 px-3 py-2 rounded-xl border border-white/15 shadow-xl text-white text-xs font-medium"
                  style={{
                    background: 'rgba(10,14,26,0.9)',
                    backdropFilter: 'blur(12px)',
                    ...(i === 0 ? { top: '-16px', right: '-16px' } : {}),
                    ...(i === 1 ? { bottom: '60px', left: '-24px' } : {}),
                    ...(i === 2 ? { bottom: '-16px', right: '30px' } : {}),
                    animation: `floatAnim ${4 + i}s ease-in-out ${card.delay}s infinite`,
                  }}
                >
                  <span className="text-base">{card.icon}</span>
                  <div>
                    <p className="font-semibold" style={{ color: card.color }}>{card.label}</p>
                    <p className="text-gray-400 text-xs">{card.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => scrollToSection('#about')}
        >
          <span className="text-gray-500 text-xs">Scroll to explore</span>
          <ChevronDown className="w-5 h-5 text-indigo-400 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}
