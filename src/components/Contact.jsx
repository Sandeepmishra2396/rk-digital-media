import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, User, Building2, ArrowRight, MapPin, MessageCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

const contactDetails = [
  {
    icon: Building2,
    label: 'Company',
    value: 'RK DIGITAL MEDIA',
    color: 'indigo',
  },
  {
    icon: User,
    label: 'Owner / Founder',
    value: 'Raushan Pathak',
    color: 'purple',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'rkdigitalmediawork@gmail.com',
    href: 'mailto:rkdigitalmediawork@gmail.com',
    color: 'blue',
  },
  {
    icon: Phone,
    label: 'Phone / WhatsApp',
    value: '+91 7631350084',
    href: 'tel:7631350084',
    color: 'green',
  },
];

const colorMap = {
  indigo: 'bg-indigo-50 text-indigo-600',
  purple: 'bg-purple-50 text-purple-600',
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-emerald-50 text-emerald-600',
};

function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.contact.submitInquiry({ name, email, phone, message });
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try WhatsApp or email directly.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 my-auto">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-emerald-900 font-bold text-lg">Inquiry Received!</h4>
        <p className="text-emerald-700 text-sm">
          Thank you for reaching out to RK Digital Media. Our artist support team has received your details and will get back to you shortly.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-2 text-xs font-semibold text-emerald-800 underline hover:text-emerald-900"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          required
          autoComplete="name"
          placeholder="Artist / Label Name"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          autoComplete="email"
          placeholder="your@email.com"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone / WhatsApp (Optional)</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="tel"
          autoComplete="tel"
          placeholder="+91 7631350084"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={3}
          placeholder="Tell us about your music, your release plans, or any questions you have..."
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full justify-center disabled:opacity-60"
      >
        {loading ? 'Sending Message...' : 'Send Message'}
        <ArrowRight className="w-4 h-4" />
      </button>

      <p className="text-xs text-gray-400 text-center">
        Your information is securely encrypted and stored directly in our database.
      </p>
    </form>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="py-16 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="section-tag">Get In Touch</span>
          <h2 className="section-title mt-2">
            Contact{' '}
            <span className="text-gradient">RK Digital Media</span>
          </h2>
          <p className="section-desc mt-4">
            Ready to distribute your music? Have questions about our services? Reach out to us directly —
            we're here to help you get started.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left: Contact info (Card wrapper to align with right form card) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="h-full"
          >
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm h-full flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Contact Information</h3>
              <p className="text-gray-500 text-sm mb-6">
                Direct lines to our artist relations and distribution team.
              </p>

            <div className="space-y-4 mb-8">
              {contactDetails.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition-all group"
                >
                  <div className={`w-11 h-11 rounded-xl ${colorMap[item.color]} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-gray-900 font-semibold hover:text-indigo-600 transition-colors truncate block"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-gray-900 font-semibold">{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:rkdigitalmediawork@gmail.com?subject=Music Distribution Inquiry"
                className="btn-primary"
              >
                <Mail className="w-4 h-4" />
                Email Us
              </a>
              <a
                href="tel:7631350084"
                className="btn-secondary"
              >
                <Phone className="w-4 h-4" />
                Call Us
              </a>
                <a
                  href="https://wa.me/917631350084?text=Hi%20RK%20Digital%20Media%2C%20I%20want%20to%20distribute%20my%20music."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 text-white font-semibold rounded-xl shadow hover:bg-emerald-700 transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: Quick contact form / message card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="h-full"
          >
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm h-full flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Send Us a Message</h3>
              <p className="text-gray-500 text-sm mb-6">
                Fill in your details and we'll get back to you as soon as possible.
              </p>

              <ContactForm />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
