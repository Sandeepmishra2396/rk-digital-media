import { motion } from 'framer-motion';
import { Music, Globe, Users, CheckCircle2, Award, Headphones } from 'lucide-react';

const highlights = [
  { icon: Globe, label: 'Digital Distribution', desc: 'Music delivered to global & Indian streaming platforms.' },
  { icon: Users, label: 'Artist & Label Support', desc: 'Serving independent artists, singers, and music labels.' },
  { icon: Award, label: 'Music Network', desc: 'Managing 71+ YouTube channels across music genres.' },
  { icon: Headphones, label: 'Platform Delivery', desc: 'From Spotify to JioSaavn — we cover it all.' },
];

const values = [
  'Long-term creator relationships',
  'Professional digital distribution',
  'Transparent process',
  'Regional language support',
  'Indian & global platform coverage',
  'Dedicated artist support',
];

export default function About() {
  return (
    <section id="about" className="py-16 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {/* Main card */}
            <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-500/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-lg">RK DIGITAL MEDIA</p>
                  <p className="text-indigo-200 text-sm">Music Distribution & Digital Media</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-3xl font-black">71+</p>
                  <p className="text-indigo-200 text-sm">Managed Channels</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-3xl font-black">20+</p>
                  <p className="text-indigo-200 text-sm">Platforms</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-3xl font-black">50+</p>
                  <p className="text-indigo-200 text-sm">Artists & Labels</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-3xl font-black">150+</p>
                  <p className="text-indigo-200 text-sm">Countries</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl">
                <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                <p className="text-sm text-indigo-100">
                  Founded by <strong>Raushan Pathak</strong> — committed to empowering artists digitally.
                </p>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Trusted Network</p>
                  <p className="text-gray-500 text-xs">Independent & Labels</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="section-tag">About Us</span>
            <h2 className="section-title mt-2 mb-5">
              Empowering Artists Through{' '}
              <span className="text-gradient">Digital Media</span>
            </h2>

            <p className="text-gray-600 leading-relaxed mb-5">
              <strong className="text-gray-900">RK DIGITAL MEDIA</strong> is a digital media and music
              distribution company focused on helping artists, singers, producers, and labels bring their
              music to digital audiences. Founded by <strong className="text-gray-900">Raushan Pathak</strong>,
              we are dedicated to making professional digital distribution accessible to every creator.
            </p>

            <p className="text-gray-600 leading-relaxed mb-6">
              We work directly with artists across Bhojpuri, Maithili, Hindi, and other regional languages,
              helping them reach audiences on major platforms — from Spotify and Apple Music to JioSaavn and
              Wynk Music. Our managed channel network represents over 71 YouTube channels, reflecting our
              commitment to long-term creator relationships.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-indigo-200 transition-colors">
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <h.icon className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{h.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Values checklist */}
            <div className="grid grid-cols-2 gap-2">
              {values.map((v, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
