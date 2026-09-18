import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Mail, Phone } from 'lucide-react';
import faqs from '../data/faqs';

export default function FAQ() {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section id="faq" className="py-16 lg:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-tag">FAQ</span>
          <h2 className="section-title mt-2">
            Frequently Asked{' '}
            <span className="text-gradient">Questions</span>
          </h2>
          <p className="section-desc mt-4">
            Everything you need to know about music distribution with RK DIGITAL MEDIA. Can't find your
            answer?{' '}
            <a
              href="mailto:rkdigitalmediawork@gmail.com"
              className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
            >
              Contact us directly.
            </a>
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openId === faq.id;

            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-indigo-200 shadow-md shadow-indigo-500/10'
                    : 'border-gray-100 hover:border-indigo-100'
                }`}
              >
                {/* Question */}
                <button
                  onClick={() => toggle(faq.id)}
                  className={`w-full flex items-start gap-4 p-5 text-left transition-colors duration-200 ${
                    isOpen ? 'bg-indigo-50/50' : 'bg-white hover:bg-gray-50'
                  }`}
                  aria-expanded={isOpen}
                >
                  {/* Number */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                      isOpen
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  {/* Question text */}
                  <span
                    className={`flex-1 font-semibold text-base leading-snug transition-colors ${
                      isOpen ? 'text-indigo-900' : 'text-gray-900'
                    }`}
                  >
                    {faq.question}
                  </span>

                  {/* Chevron */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown
                      className={`w-5 h-5 transition-colors ${
                        isOpen ? 'text-indigo-600' : 'text-gray-400'
                      }`}
                    />
                  </motion.div>
                </button>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-2 ml-12">
                        <p className="text-gray-600 leading-relaxed text-sm">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
          <HelpCircle className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
          <h3 className="font-bold text-gray-900 text-lg mb-2">Still have questions?</h3>
          <p className="text-gray-500 text-sm mb-4">
            Our team is ready to help you with any questions about music distribution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <a
              href="mailto:rkdigitalmediawork@gmail.com"
              className="btn-primary text-sm px-6 py-3 min-h-[44px] min-w-[140px] justify-center"
            >
              <Mail className="w-4 h-4" />
              <span>Email Us</span>
            </a>
            <a
              href="tel:7631350084"
              className="btn-secondary text-sm px-6 py-3 min-h-[44px] min-w-[140px] justify-center"
            >
              <Phone className="w-4 h-4" />
              <span>Call Us</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
