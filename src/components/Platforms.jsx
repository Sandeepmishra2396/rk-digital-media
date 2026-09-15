import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Globe, Smartphone, Phone, Play, ExternalLink } from 'lucide-react';
import platforms, { platformCategories } from '../data/platforms';

const categoryIcons = {
  All: Globe,
  Global: Globe,
  Indian: Music,
  Social: Smartphone,
  'Caller Tunes': Phone,
};

const platformIconMap = {
  spotify: '🎵',
  apple: '🍎',
  amazon: '📦',
  youtube: '▶️',
  deezer: '💠',
  music: '🎼',
  soundcloud: '☁️',
  saavn: '🎤',
  instagram: '📸',
  facebook: '📘',
  video: '📹',
  phone: '📞',
};

export default function Platforms() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return platforms;
    return platforms.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="platforms" className="py-16 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-tag">Platform Directory</span>
          <h2 className="section-title mt-2">
            Where Your Music{' '}
            <span className="text-gradient">Goes Live</span>
          </h2>
          <p className="section-desc mt-4">
            Distribute your music to major global and Indian streaming platforms, social media channels,
            and caller tune networks — all in one place.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {platformCategories.map((cat) => {
            const Icon = categoryIcons[cat] || Globe;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat}
                <span
                  className={`text-xs rounded-full px-2 py-0.5 font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {cat === 'All' ? platforms.length : platforms.filter((p) => p.category === cat).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Platform Grid */}
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filtered.map((platform) => {
              const emoji = platformIconMap[platform.icon] || '🎵';
              return (
                <motion.div
                  key={platform.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className="platform-card bg-white rounded-2xl border border-gray-100 p-5 group cursor-default"
                >
                  {/* Top */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                      style={{ background: platform.bgColor || '#f5f3ff' }}
                    >
                      {emoji}
                    </div>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                      style={{
                        color: platform.color,
                        background: platform.bgColor,
                        borderColor: platform.color + '33',
                      }}
                    >
                      {platform.category}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="font-bold text-gray-900 text-base mb-1.5 leading-tight group-hover:text-indigo-700 transition-colors">
                    {platform.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-500 text-xs leading-relaxed mb-3">
                    {platform.description}
                  </p>

                  {/* Benefit */}
                  {platform.benefit && (
                    <div className="p-2.5 bg-indigo-50 rounded-xl mb-3">
                      <p className="text-indigo-700 text-xs font-medium">{platform.benefit}</p>
                    </div>
                  )}

                  {/* Featured badge */}
                  {platform.featured && (
                    <div className="flex items-center gap-1 mt-auto">
                      <span className="text-amber-500 text-xs font-semibold">⭐ Featured Platform</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Bottom note */}
        <p className="text-center text-gray-400 text-sm mt-8">
          Platform availability may vary. Contact us to confirm distribution to specific platforms.
        </p>
      </div>
    </section>
  );
}
