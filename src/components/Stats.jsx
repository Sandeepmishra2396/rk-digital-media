import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Globe, Youtube, Mic, MapPin, Music, TrendingUp } from 'lucide-react';
import stats from '../data/stats';

const iconMap = {
  Globe,
  Youtube,
  Mic,
  MapPin,
  Music,
};

const colorMap = {
  indigo: {
    bg: 'bg-indigo-50',
    icon: 'text-indigo-600',
    gradient: 'from-indigo-500 to-indigo-700',
    border: 'border-indigo-100',
    badge: 'bg-indigo-100 text-indigo-600',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    gradient: 'from-red-500 to-red-700',
    border: 'border-red-100',
    badge: 'bg-red-100 text-red-600',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    gradient: 'from-purple-500 to-purple-700',
    border: 'border-purple-100',
    badge: 'bg-purple-100 text-purple-600',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-700',
    border: 'border-blue-100',
    badge: 'bg-blue-100 text-blue-600',
  },
};

function Counter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, target, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function Stats() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="section-tag">By the Numbers</span>
          <h2 className="section-title mt-2">
            RK Digital Media{' '}
            <span className="text-gradient">At a Glance</span>
          </h2>
          <p className="section-desc mt-4">
            A growing music distribution network serving artists, labels, and channels across India and beyond.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => {
            const Icon = iconMap[stat.icon] || Music;
            const colors = colorMap[stat.color] || colorMap.indigo;

            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative overflow-hidden rounded-2xl border ${colors.border} ${colors.bg} p-6 text-center group hover:shadow-lg transition-all duration-300`}
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-gradient-to-br ${colors.gradient}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Number */}
                <div className="text-3xl md:text-4xl font-black text-gray-900 mb-1">
                  <Counter target={stat.value} />
                  <span>{stat.suffix}</span>
                </div>

                {/* Label */}
                <p className="text-sm font-semibold text-gray-600 mb-2">{stat.label}</p>

                {/* Trend */}
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${colors.badge}`}>
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </span>

                {/* Background decoration */}
                <div
                  className={`absolute -bottom-4 -right-4 w-16 h-16 rounded-full opacity-10 bg-gradient-to-br ${colors.gradient}`}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
