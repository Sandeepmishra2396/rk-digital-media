import { motion } from 'framer-motion';
import {
  Youtube,
  Shield,
  TrendingUp,
  Music,
  ArrowRight,
  Award,
  CheckCircle2,
  Globe,
  Users,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const networkPillars = [
  {
    icon: Youtube,
    title: '498+ Managed YouTube Channels',
    description:
      'End-to-end multi-channel network management, Official Artist Channel (OAC) setup, SEO optimization, and strategic audience growth across YouTube.',
    color: 'from-red-500 to-rose-600',
    bg: 'bg-red-50',
    border: 'border-red-100 hover:border-red-300',
    tag: 'Creator Network',
  },
  {
    icon: Users,
    title: '219+ Artists & Labels Empowered',
    description:
      'Direct partnerships with independent singers, producers, and regional record labels with transparent distribution, metadata management, and dedicated support.',
    color: 'from-purple-500 to-indigo-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100 hover:border-purple-300',
    tag: 'Direct Partnerships',
  },
  {
    icon: Shield,
    title: 'Content ID & Copyright Protection',
    description:
      'Automated audio fingerprinting and digital rights management across video platforms to claim royalties and prevent unauthorized usage of your sound recordings.',
    color: 'from-blue-500 to-cyan-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100 hover:border-blue-300',
    tag: 'Rights Security',
  },
  {
    icon: Globe,
    title: 'Global Reach Across 15+ Countries',
    description:
      'Taking Indian regional and mainstream music beyond borders, connecting artists with listeners and diaspora audiences across 15+ countries worldwide.',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100 hover:border-emerald-300',
    tag: 'Worldwide Reach',
  },
];

const genreCoverage = [
  'Bhojpuri Music',
  'Maithili Songs',
  'Hindi / Bollywood Pop',
  'Devotional & Bhakti',
  'Regional Folk & Traditional',
  'Independent Singles',
];

export default function Network() {
  const { user, openAuthModal, openDashboard } = useAuth();

  return (
    <section id="network" className="py-16 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="section-tag">Our Network</span>
          <h2 className="section-title mt-2">
            Powering a Growing{' '}
            <span className="text-gradient">Music Network</span>
          </h2>
          <p className="section-desc mt-4 max-w-3xl mx-auto">
            RK DIGITAL MEDIA manages a multi-channel network of{' '}
            <strong className="text-gray-900">498+ YouTube channels</strong> and partners with{' '}
            <strong className="text-gray-900">219+ artists & labels</strong> across{' '}
            <strong className="text-gray-900">15+ countries</strong>, driving audience growth,
            digital monetization, and full copyright protection.
          </p>
        </div>

        {/* Network Pillars Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {networkPillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`bg-white rounded-2xl border-2 ${pillar.border} p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-lg`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${pillar.color} flex items-center justify-center text-white shadow-md`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2.5">{pillar.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">{pillar.description}</p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-indigo-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Verified RK Digital Media Network Service</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Network Scale & Genre Coverage Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-gradient-to-br from-[#0c1226] via-[#111936] to-[#1c183d] text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden mb-12"
        >
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Network Diversity & Scale</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black mb-4">
              Comprehensive Multi-Genre Network Reach
            </h3>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mb-8 leading-relaxed">
              Our channel network brings together diverse regional and mainstream musical cultures under one
              centralized, high-performance distribution umbrella.
            </p>

            {/* Genre tags */}
            <div className="flex flex-wrap gap-2.5 mb-10">
              {genreCoverage.map((genre) => (
                <div
                  key={genre}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2"
                >
                  <Music className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{genre}</span>
                </div>
              ))}
            </div>

            {/* Quick Stat Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/10 text-center">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white">498+</p>
                <p className="text-xs text-indigo-300 font-medium mt-1">Managed Channels</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white">219+</p>
                <p className="text-xs text-indigo-300 font-medium mt-1">Artists & Labels</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white">20+</p>
                <p className="text-xs text-indigo-300 font-medium mt-1">Platforms</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white">15+</p>
                <p className="text-xs text-indigo-300 font-medium mt-1">Countries</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Network Partnership Callout */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-base">Want to partner with RK DIGITAL MEDIA?</h4>
              <p className="text-gray-500 text-sm mt-0.5">
                Join our network of 498+ managed channels and 219+ artists & labels.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => (user ? openDashboard() : openAuthModal('signup'))}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-md hover:shadow-indigo-500/25 transition-all"
            >
              <span>{user ? 'Open Dashboard' : 'Join Our Network'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="mailto:rkdigitalmediawork@gmail.com?subject=Channel Network Inquiry"
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Inquire
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
