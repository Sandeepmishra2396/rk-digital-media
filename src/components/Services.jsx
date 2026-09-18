import { motion } from 'framer-motion';
import {
  Globe, Youtube, Award, Mic, Phone, Share2,
  Upload, Network, Shield, ArrowRight, CheckCircle2
} from 'lucide-react';
import services from '../data/services';

const iconComponents = {
  Globe, Youtube, Award, Mic, Phone, Share2,
  Upload, Network, Shield,
};

const colorMap = {
  indigo: {
    bg: 'bg-indigo-50',
    icon: 'bg-indigo-100 text-indigo-600',
    border: 'border-indigo-100 hover:border-indigo-300',
    badge: 'bg-indigo-100 text-indigo-700',
    ring: 'ring-indigo-100',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'bg-red-100 text-red-600',
    border: 'border-red-100 hover:border-red-300',
    badge: 'bg-red-100 text-red-700',
    ring: 'ring-red-100',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'bg-purple-100 text-purple-600',
    border: 'border-purple-100 hover:border-purple-300',
    badge: 'bg-purple-100 text-purple-700',
    ring: 'ring-purple-100',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-100 text-blue-600',
    border: 'border-blue-100 hover:border-blue-300',
    badge: 'bg-blue-100 text-blue-700',
    ring: 'ring-blue-100',
  },
  green: {
    bg: 'bg-emerald-50',
    icon: 'bg-emerald-100 text-emerald-600',
    border: 'border-emerald-100 hover:border-emerald-300',
    badge: 'bg-emerald-100 text-emerald-700',
    ring: 'ring-emerald-100',
  },
  pink: {
    bg: 'bg-pink-50',
    icon: 'bg-pink-100 text-pink-600',
    border: 'border-pink-100 hover:border-pink-300',
    badge: 'bg-pink-100 text-pink-700',
    ring: 'ring-pink-100',
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'bg-orange-100 text-orange-600',
    border: 'border-orange-100 hover:border-orange-300',
    badge: 'bg-orange-100 text-orange-700',
    ring: 'ring-orange-100',
  },
  teal: {
    bg: 'bg-teal-50',
    icon: 'bg-teal-100 text-teal-600',
    border: 'border-teal-100 hover:border-teal-300',
    badge: 'bg-teal-100 text-teal-700',
    ring: 'ring-teal-100',
  },
  violet: {
    bg: 'bg-violet-50',
    icon: 'bg-violet-100 text-violet-600',
    border: 'border-violet-100 hover:border-violet-300',
    badge: 'bg-violet-100 text-violet-700',
    ring: 'ring-violet-100',
  },
};

export default function Services() {
  return (
    <section id="services" className="py-16 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="section-tag">What We Offer</span>
          <h2 className="section-title mt-2">
            Complete{' '}
            <span className="text-gradient">Music Services</span>
          </h2>
          <p className="section-desc mt-4">
            From independent artist releases to full label distribution — RK DIGITAL MEDIA provides
            everything you need to establish your music presence digitally.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => {
            const Icon = iconComponents[service.icon] || Globe;
            const colors = colorMap[service.color] || colorMap.indigo;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                className={`rounded-2xl border-2 ${colors.border} ${colors.bg} p-6 group transition-all duration-300 hover:shadow-lg cursor-default`}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl ${colors.icon} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight">{service.title}</h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{service.description}</p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Section Banner (Fix for Issue 12) */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 rounded-2xl border border-indigo-100 shadow-sm text-center sm:text-left">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Ready to distribute your music worldwide?</h3>
              <p className="text-gray-600 text-sm mt-1">Contact RK DIGITAL MEDIA to get started with distribution today.</p>
            </div>
            <a
              href="mailto:rkdigitalmediawork@gmail.com?subject=Music Distribution Inquiry"
              className="btn-primary whitespace-nowrap px-7 py-3.5 flex-shrink-0"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
