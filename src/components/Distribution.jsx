import { motion } from 'framer-motion';
import { Upload, CheckSquare, Send, Users, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload Your Music',
    description:
      'Submit your audio track in high-quality format along with cover artwork, track title, artist name, genre, language, and all required metadata.',
    color: 'indigo',
    details: ['WAV / FLAC / MP3 audio', 'Cover artwork 3000×3000px', 'Complete metadata'],
  },
  {
    number: '02',
    icon: CheckSquare,
    title: 'Review & Quality Check',
    description:
      'Our team reviews your release information, verifies audio quality, checks artwork compliance, and prepares your release for platform submission.',
    color: 'purple',
    details: ['Audio quality verification', 'Artwork compliance check', 'Metadata validation'],
  },
  {
    number: '03',
    icon: Send,
    title: 'Deliver to Platforms',
    description:
      'Your music is delivered to all supported digital streaming platforms and social media channels as per your release schedule.',
    color: 'blue',
    details: ['Multi-platform delivery', 'Release date scheduling', 'Content ID submission'],
  },
  {
    number: '04',
    icon: Users,
    title: 'Reach Your Audience',
    description:
      'Your music becomes available to listeners worldwide on streaming platforms, social media, and caller tune networks across India.',
    color: 'green',
    details: ['Live on 20+ platforms', 'Indian & global reach', 'Caller tune availability'],
  },
];

const colorMap = {
  indigo: {
    bg: 'bg-indigo-50',
    icon: 'bg-indigo-100 text-indigo-600',
    badge: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    border: 'border-indigo-200',
    number: 'text-indigo-200',
    step: 'bg-indigo-600',
    connector: 'bg-indigo-200',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'bg-purple-100 text-purple-600',
    badge: 'text-purple-600 bg-purple-50 border-purple-200',
    border: 'border-purple-200',
    number: 'text-purple-200',
    step: 'bg-purple-600',
    connector: 'bg-purple-200',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-100 text-blue-600',
    badge: 'text-blue-600 bg-blue-50 border-blue-200',
    border: 'border-blue-200',
    number: 'text-blue-200',
    step: 'bg-blue-600',
    connector: 'bg-blue-200',
  },
  green: {
    bg: 'bg-emerald-50',
    icon: 'bg-emerald-100 text-emerald-600',
    badge: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    border: 'border-emerald-200',
    number: 'text-emerald-200',
    step: 'bg-emerald-600',
    connector: 'bg-emerald-200',
  },
};

export default function Distribution() {
  return (
    <section id="distribution" className="py-16 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="section-tag">How It Works</span>
          <h2 className="section-title mt-2">
            Simple{' '}
            <span className="text-gradient">Distribution Process</span>
          </h2>
          <p className="section-desc mt-4">
            Get your music from your hard drive to listeners worldwide in four straightforward steps.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line on desktop */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 via-blue-200 to-emerald-200 z-0" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            const colors = colorMap[step.color];

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className={`relative rounded-2xl border ${colors.border} ${colors.bg} p-6 group hover:shadow-lg transition-all duration-300`}
              >
                {/* Step number bg */}
                <div className={`absolute top-4 right-4 text-6xl font-black ${colors.number} leading-none select-none`}>
                  {step.number}
                </div>

                {/* Icon circle */}
                <div className={`relative z-10 w-14 h-14 rounded-2xl ${colors.icon} flex items-center justify-center mb-5 shadow-sm`}>
                  <Icon className="w-7 h-7" />
                </div>

                {/* Step badge */}
                <span className={`inline-block text-xs font-bold uppercase tracking-wider border rounded-full px-2.5 py-0.5 mb-3 ${colors.badge}`}>
                  Step {step.number}
                </span>

                <h3 className="text-gray-900 font-bold text-lg mb-2 leading-tight">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{step.description}</p>

                {/* Details */}
                <ul className="space-y-1.5">
                  {step.details.map((d, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-gray-500">
                      <div className={`w-1.5 h-1.5 rounded-full ${colors.step} flex-shrink-0`} />
                      {d}
                    </li>
                  ))}
                </ul>

                {/* Arrow between steps */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 bg-white rounded-full border-2 border-gray-200 items-center justify-center shadow-sm">
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="mailto:rkdigitalmediawork@gmail.com?subject=Music Distribution Inquiry"
            className="btn-primary text-base px-8 py-4"
          >
            Start Your Distribution
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
