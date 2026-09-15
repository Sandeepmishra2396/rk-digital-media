import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Music, Globe, Play } from 'lucide-react';

const featured = [
  {
    name: 'Spotify',
    emoji: '🎵',
    tagline: 'Reach 600M+ Global Listeners',
    color: '#1DB954',
    bg: 'from-green-900/80 to-green-800/40',
    borderColor: '#1DB954',
    description:
      'Spotify is the world\'s largest music streaming platform. Getting your music on Spotify means reaching hundreds of millions of listeners across the globe, appearing in algorithmic playlists, and building your monthly listener count.',
    benefits: [
      'Access to 600M+ active monthly users',
      'Eligibility for editorial playlists',
      'Spotify for Artists dashboard access',
      'Algorithmic radio and discover weekly',
    ],
  },
  {
    name: 'Apple Music',
    emoji: '🍎',
    tagline: 'Premium Global Distribution',
    color: '#FC3C44',
    bg: 'from-red-900/80 to-red-800/40',
    borderColor: '#FC3C44',
    description:
      'Apple Music delivers your music to premium listeners in 167 countries. With a subscriber base of passionate music fans, your tracks appear alongside global artists in one of the world\'s most respected digital music stores.',
    benefits: [
      '100M+ subscribers in 167 countries',
      'Apple Music editorial opportunities',
      'Spatial Audio / Dolby Atmos support',
      'iTunes Store digital download sales',
    ],
  },
  {
    name: 'YouTube Music',
    emoji: '▶️',
    tagline: 'Video + Audio Distribution',
    color: '#FF0000',
    bg: 'from-red-900/80 to-orange-900/40',
    borderColor: '#FF0000',
    description:
      'YouTube Music is Google\'s dedicated music streaming service, combining audio and video. Distribution to YouTube Music also connects with YouTube Content ID — earning royalties whenever your music appears in user videos.',
    benefits: [
      'Music available on YouTube Music app',
      'Content ID for YouTube video royalties',
      'Reach billions of YouTube users',
      'Official Music Video linking',
    ],
  },
];

export default function FeaturedPlatforms() {
  return (
    <section
      className="py-16 lg:py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0e1a 0%, #111827 100%)' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-full h-full opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-3 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
            Featured Platforms
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mt-2">
            Major Platforms.{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #818cf8, #a855f7, #60a5fa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Maximum Reach.
            </span>
          </h2>
          <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto">
            These are among the most important platforms for any music release today.
            RK DIGITAL MEDIA helps you get your music on all of them.
          </p>
        </div>

        {/* Featured Platform Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((platform, i) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="relative rounded-2xl overflow-hidden border group hover:scale-[1.02] transition-transform duration-300"
              style={{ borderColor: platform.borderColor + '40' }}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${platform.bg}`} />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `radial-gradient(circle at top left, ${platform.color}15, transparent 70%)` }}
              />

              <div className="relative p-6">
                {/* Platform identity */}
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                    style={{ background: platform.color + '20', border: `1px solid ${platform.color}40` }}
                  >
                    {platform.emoji}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl">{platform.name}</h3>
                    <p className="text-sm font-medium" style={{ color: platform.color }}>
                      {platform.tagline}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm leading-relaxed mb-5">
                  {platform.description}
                </p>

                {/* Benefits */}
                <ul className="space-y-2 mb-5">
                  {platform.benefits.map((b, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: platform.color }} />
                      {b}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="mailto:rkdigitalmediawork@gmail.com?subject=Distribute to Platform"
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                  style={{ color: platform.color }}
                >
                  Get Your Music On {platform.name}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View all platforms button */}
        <div className="text-center mt-10">
          <button
            onClick={() => {
              const el = document.querySelector('#platforms');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-medium rounded-xl hover:bg-white/10 hover:border-indigo-400 transition-all text-sm"
          >
            <Music className="w-4 h-4 text-indigo-400" />
            View All Platforms
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
