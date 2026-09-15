import { Music, Mail, Phone, ArrowRight, Youtube, Instagram, MessageCircle, LogIn, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Distribution', href: '#distribution' },
  { label: 'Platforms', href: '#platforms' },
];

const serviceLinks = [
  { label: 'Music Distribution', href: '#services' },
  { label: 'YouTube Music', href: '#services' },
  { label: 'Caller Tunes / CRBT', href: '#services' },
  { label: 'Label Services', href: '#services' },
  { label: 'Social Media Music', href: '#services' },
];

const moreLinks = [
  { label: 'Our Network', href: '#network' },
  { label: 'Services', href: '#services' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

function handleNavClick(href) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Footer() {
  const { user, openAuthModal, openDashboard } = useAuth();
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: '#050813', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}
              className="inline-flex items-center gap-2.5 mb-5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Music className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="block text-white font-bold text-sm tracking-wide">RK DIGITAL</span>
                <span className="block text-indigo-400 font-semibold text-xs tracking-widest uppercase">MEDIA</span>
              </div>
            </a>

            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              A digital media and music distribution company helping artists, singers, producers, and
              labels bring their music to digital audiences worldwide.
            </p>

            <p className="text-gray-500 text-xs mb-1">Founded by</p>
            <p className="text-white font-semibold text-sm mb-4">Raushan Pathak</p>

            {/* Social links */}
            <div className="flex gap-3">
              <a
                href="mailto:rkdigitalmediawork@gmail.com"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-600 transition-all duration-200"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/917631350084"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-green-600 hover:border-green-600 transition-all duration-200"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@RKDigitalMediaNetwork"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all duration-200"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                    className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all duration-200 text-indigo-400" />
                    {link.label}
                  </a>
                </li>
              ))}
              {moreLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                    className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all duration-200 text-indigo-400" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Services</h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                    className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all duration-200 text-indigo-400" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Email</p>
                  <a
                    href="mailto:rkdigitalmediawork@gmail.com"
                    className="text-gray-300 hover:text-white text-sm transition-colors break-all"
                  >
                    rkdigitalmediawork@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Phone / WhatsApp</p>
                  <a
                    href="tel:7631350084"
                    className="text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    +91 7631350084
                  </a>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() => (user ? openDashboard() : openAuthModal('signup'))}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-200"
                >
                  <span>{user ? 'Open Artist Dashboard' : 'Get Started'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => (user ? openDashboard() : openAuthModal('signin'))}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-white/20 text-gray-300 hover:text-white hover:bg-white/5 text-xs font-semibold rounded-xl transition-all"
                >
                  {user ? <LayoutDashboard className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
                  <span>{user ? 'My Artist Account' : 'Artist / Label Sign In'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">
            © {year} <span className="text-gray-400 font-medium">RK DIGITAL MEDIA</span>. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Music Distribution & Digital Media — India
          </p>
        </div>
      </div>
    </footer>
  );
}
