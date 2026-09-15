import { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Music,
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Platforms', href: '#platforms' },
  { label: 'Our Network', href: '#network' },
  { label: 'About Us', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, openAuthModal, openDashboard, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleNavClick = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-navy-900/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-white/5'
            : 'bg-transparent'
        }`}
        style={{ background: scrolled ? 'rgba(8, 11, 20, 0.96)' : 'transparent' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#home');
              }}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/40 transition-shadow">
                <Music className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <span className="block text-white font-bold text-sm md:text-base tracking-wide">
                  RK DIGITAL
                </span>
                <span className="block text-indigo-400 font-semibold text-xs tracking-widest uppercase">
                  MEDIA
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <ul className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="px-3.5 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Desktop Auth Action Buttons (Inspired directly by screenshot) */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                /* Logged In User State */
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={openDashboard}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all text-sm font-medium group"
                    title="Open Artist Dashboard"
                  >
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="max-w-[110px] truncate font-semibold">{user.name}</span>
                    <LayoutDashboard className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
                  </button>

                  <button
                    onClick={openDashboard}
                    className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md transition-all"
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={logout}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-xl transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Guest State: Sign In & Sign Up (Matching uploaded screenshot) */
                <div className="flex items-center gap-2.5">
                  {/* Sign In button with ➜] icon */}
                  <button
                    onClick={() => openAuthModal('signin')}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-black/40 hover:bg-white/10 border border-white/20 hover:border-white/40 rounded-xl transition-all duration-200 shadow-sm"
                  >
                    <span>Sign In</span>
                    <LogIn className="w-4 h-4 text-gray-300" />
                  </button>

                  {/* Sign Up button with 👤+ icon */}
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200"
                  >
                    <span>Sign Up</span>
                    <UserPlus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-navy-900 shadow-2xl lg:hidden flex flex-col"
              style={{ background: '#0a0e1a' }}
            >
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Music className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-bold text-sm">RK DIGITAL MEDIA</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile User Status / Auth Buttons */}
              <div className="p-4 border-b border-white/10 bg-white/[0.02]">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                        {user.name ? user.name[0].toUpperCase() : 'U'}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-white text-xs font-bold truncate">{user.name}</p>
                        <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => {
                          setMobileOpen(false);
                          openDashboard();
                        }}
                        className="flex-1 py-2 text-center rounded-xl bg-indigo-600 text-white text-xs font-semibold"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => {
                          setMobileOpen(false);
                          logout();
                        }}
                        className="px-3 py-2 rounded-xl bg-red-500/15 text-red-300 text-xs font-semibold"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        openAuthModal('signin');
                      }}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-white/20 bg-white/5 text-white text-xs font-semibold hover:bg-white/10"
                    >
                      <span>Sign In</span>
                      <LogIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        openAuthModal('signup');
                      }}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold shadow-md"
                    >
                      <span>Sign Up</span>
                      <UserPlus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <nav className="p-4 flex-1 overflow-y-auto">
                <ul className="space-y-1">
                  {navLinks.map((link, i) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <a
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(link.href);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/8 rounded-xl transition-all duration-200 text-sm font-medium"
                      >
                        {link.label}
                      </a>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                  <a
                    href="mailto:rkdigitalmediawork@gmail.com"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-xs font-semibold text-white border border-white/20 rounded-xl hover:bg-white/5"
                  >
                    Email Support
                  </a>
                  <a
                    href="tel:7631350084"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30 bg-emerald-500/10 rounded-xl"
                  >
                    Call: 7631350084
                  </a>
                </div>
              </nav>

              <div className="p-4 border-t border-white/10 text-center">
                <p className="text-xs text-gray-400 font-semibold">RK DIGITAL MEDIA</p>
                <p className="text-[11px] text-gray-500">Founder: Raushan Pathak</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
