'use client';

import { useState, type FormEvent, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Mail,
  Linkedin,
  Github,
  MessageCircle,
  Send,
  CheckCircle,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import SectionReveal from './SectionReveal';
import { GradientBorderCard } from './AnimatedElements';

const socials = [
  {
    icon: Mail,
    label: 'Email',
    href: 'mailto:manpreet@example.com',
    display: 'manpreet@example.com',
    color: 'from-cyan-500 to-blue-500',
    bgHover: 'group-hover:bg-cyan-500/20',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/manpreet-singh',
    display: 'linkedin.com/in/manpreet-singh',
    color: 'from-blue-500 to-blue-600',
    bgHover: 'group-hover:bg-blue-500/20',
  },
  {
    icon: Github,
    label: 'GitHub',
    href: 'https://github.com/manpreet-singh',
    display: 'github.com/manpreet-singh',
    color: 'from-purple-500 to-purple-600',
    bgHover: 'group-hover:bg-purple-500/20',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    href: 'https://wa.me/919999999999',
    display: 'Chat on WhatsApp',
    color: 'from-emerald-500 to-emerald-600',
    bgHover: 'group-hover:bg-emerald-500/20',
  },
];

function FloatingOrb({ delay, size, x, y }: { delay: number; size: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/5 blur-2xl"
      style={{ width: size, height: size, left: x, top: y }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{ duration: 6, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setSubmitted(true);
    } catch {
      // Silently handle
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      {/* Floating orbs */}
      <FloatingOrb delay={0} size={300} x="10%" y="20%" />
      <FloatingOrb delay={2} size={200} x="70%" y="60%" />
      <FloatingOrb delay={4} size={250} x="50%" y="10%" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10" ref={ref}>
        <SectionReveal>
          <div className="text-center mb-20">
            <motion.p
              className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400 font-semibold mb-4"
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              animate={isInView ? { opacity: 1, letterSpacing: '0.3em' } : {}}
              transition={{ duration: 1 }}
            >
              Contact
            </motion.p>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
              Let&apos;s <span className="gradient-text">Connect</span>
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm">
              Have an idea, a project, or just want to chat? I&apos;d love to hear from you.
            </p>
          </div>
        </SectionReveal>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Social links */}
          <SectionReveal direction="left">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles size={16} className="text-cyan-500" />
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Find me online
                </h3>
              </div>

              {socials.map((social, i) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center gap-4 p-4 rounded-xl glass bg-white/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-700/30 hover:border-cyan-500/30 dark:hover:border-cyan-500/30 transition-all duration-300 overflow-hidden"
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                    whileHover={{ x: 4 }}
                  >
                    {/* Hover gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${social.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

                    <div className={`relative p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 ${social.bgHover} transition-colors duration-300`}>
                      <Icon size={20} className="text-slate-600 dark:text-slate-400 group-hover:text-cyan-500 transition-colors" />
                    </div>
                    <div className="flex-1 relative">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-medium mb-0.5">
                        {social.label}
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-medium group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                        {social.display}
                      </p>
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="text-slate-400 dark:text-slate-600 group-hover:text-cyan-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    />
                  </motion.a>
                );
              })}

              {/* Availability status */}
              <motion.div
                className="mt-6 p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-200/50 dark:border-emerald-500/10"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-3 h-3 rounded-full bg-emerald-400"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div>
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Available for opportunities</p>
                    <p className="text-[11px] text-emerald-600/70 dark:text-emerald-500/60">Typically responds within 24 hours</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </SectionReveal>

          {/* Contact form */}
          <SectionReveal direction="right">
            <GradientBorderCard>
              <div className="p-8">
                {submitted ? (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CheckCircle size={56} className="text-emerald-500 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Thank you for reaching out. I&apos;ll get back to you soon.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Send size={14} className="text-cyan-500" />
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Send a message
                      </span>
                    </div>

                    {[
                      { id: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
                      { id: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
                    ].map((field) => (
                      <div key={field.id} className="relative">
                        <label
                          htmlFor={field.id}
                          className={`block text-xs font-medium mb-1.5 transition-colors duration-200 ${
                            focusedField === field.id
                              ? 'text-cyan-600 dark:text-cyan-400'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {field.label}
                        </label>
                        <input
                          id={field.id}
                          name={field.id}
                          type={field.type}
                          required
                          onFocus={() => setFocusedField(field.id)}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/40 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                          placeholder={field.placeholder}
                        />
                      </div>
                    ))}

                    <div className="relative">
                      <label
                        htmlFor="message"
                        className={`block text-xs font-medium mb-1.5 transition-colors duration-200 ${
                          focusedField === 'message'
                            ? 'text-cyan-600 dark:text-cyan-400'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={4}
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/40 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                        placeholder="Tell me about your project..."
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {/* Shimmer sweep effect */}
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={18} />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            </GradientBorderCard>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
