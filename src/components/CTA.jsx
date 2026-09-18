import { motion } from 'framer-motion';
import { ArrowRight, Music, Headphones, Globe, Star, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CTA() {
  const { user, openAuthModal, openDashboard } = useAuth();
  return (
    <section
      className="py-16 lg:py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%)' }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-20 bg-white" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-15 bg-blue-300" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 rounded-full border border-white/25 mb-6"
        >
          <Star className="w-4 h-4 text-amber-300" />
          <span className="text-white text-sm font-medium">Start Your Distribution Today</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-5"
        >
          Ready to Share Your Music
          <br />
          with the{' '}
          <span className="text-yellow-300">World?</span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Contact <strong className="text-white">RK DIGITAL MEDIA</strong> today and let us help you
          distribute your music across streaming platforms and reach listeners worldwide.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
        >
          <button
            onClick={() => (user ? openDashboard() : openAuthModal('signup'))}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl shadow-xl hover:bg-gray-50 hover:shadow-white/20 transition-all duration-300 text-base"
          >
            <Music className="w-5 h-5" />
            <span>{user ? 'Open Artist Dashboard' : 'Distribute Your Music'}</span>
          </button>
          <a
            href="tel:7631350084"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/30 hover:border-white/60 transition-all duration-300 text-base shadow-sm"
          >
            <Phone className="w-5 h-5" />
            <span>Call Us Now</span>
          </a>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          {[
            { icon: Globe, label: '20+ Platforms' },
            { icon: Headphones, label: '71+ Channels' },
            { icon: Music, label: '150+ Countries' },
            { icon: Star, label: 'Artist Support' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-white/80 text-sm">
              <item.icon className="w-4 h-4 text-yellow-300" />
              <span>{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
