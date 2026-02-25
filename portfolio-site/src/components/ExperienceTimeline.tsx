'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase, Calendar, Zap, ArrowUpRight } from 'lucide-react';
import SectionReveal from './SectionReveal';
import { AnimatedCounter, GradientBorderCard } from './AnimatedElements';

const responsibilities = [
  {
    text: 'Architecting and building full-stack applications with React, Node.js, and Python',
    tag: 'Full Stack',
  },
  {
    text: 'Designing scalable microservice architectures and event-driven systems',
    tag: 'Architecture',
  },
  {
    text: 'Implementing AI/ML pipelines for intelligent automation',
    tag: 'AI/ML',
  },
  {
    text: 'Managing cloud infrastructure, CI/CD pipelines, and deployment strategies',
    tag: 'Cloud',
  },
  {
    text: 'Building responsive frontend interfaces with TypeScript and modern frameworks',
    tag: 'Frontend',
  },
  {
    text: 'Designing database schemas, optimizing queries, and managing data pipelines',
    tag: 'Data',
  },
];

const stats = [
  { label: 'Years Active', value: (() => { const start = new Date(2022, 6, 1); const now = new Date(); return Math.max(1, Math.floor((now.getTime() - start.getTime()) / (365.25 * 86400000))); })(), suffix: '+' },
  { label: 'Projects Shipped', value: 30, suffix: '+' },
  { label: 'Technologies', value: 25, suffix: '+' },
  { label: 'Lines of Code', value: 500, suffix: 'K+' },
];

export default function ExperienceTimeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="experience" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 dark:via-slate-900/20 to-transparent" />

      {/* Decorative grid dots */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]" style={{
        backgroundImage: 'radial-gradient(circle, #06b6d4 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10" ref={ref}>
        <SectionReveal>
          <div className="text-center mb-20">
            <motion.p
              className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400 font-semibold mb-4"
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              animate={isInView ? { opacity: 1, letterSpacing: '0.3em' } : {}}
              transition={{ duration: 1 }}
            >
              Experience
            </motion.p>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
              Professional <span className="gradient-text">Journey</span>
            </h2>
          </div>
        </SectionReveal>

        {/* Main experience card */}
        <SectionReveal>
          <GradientBorderCard>
            <div className="p-5 sm:p-8 md:p-10">
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                <div className="flex items-start gap-4">
                  {/* Animated icon */}
                  <motion.div
                    className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20"
                    animate={isInView ? { rotate: [0, -3, 3, 0] } : {}}
                    transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <Briefcase size={24} className="text-cyan-500" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Software Engineer
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar size={14} className="text-cyan-500" />
                      <span className="text-sm text-cyan-600 dark:text-cyan-400 font-medium">
                        Jul 2022 — Present
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live badge */}
                <motion.div
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <motion.div
                    className="w-2 h-2 rounded-full bg-emerald-400"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Currently Active</span>
                </motion.div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/20 border border-slate-200/50 dark:border-slate-700/20">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  >
                    <div className="text-2xl font-bold gradient-text">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} delay={0.5 + i * 0.15} />
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Responsibilities */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={16} className="text-cyan-500" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Key Contributions</span>
                </div>
                {responsibilities.map((r, j) => (
                  <motion.div
                    key={j}
                    className="group flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + j * 0.08, duration: 0.4 }}
                  >
                    <ArrowUpRight size={16} className="text-cyan-500 mt-0.5 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {r.text}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-500/60 bg-cyan-500/5 px-2 py-1 rounded-md shrink-0 hidden sm:block">
                      {r.tag}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Bottom impact statement */}
              <motion.div
                className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/30"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 1.2 }}
              >
                <p className="text-sm text-slate-500 dark:text-slate-400 italic text-center">
                  &ldquo;Driving system reliability, delivery velocity, and product quality across the stack.&rdquo;
                </p>
              </motion.div>
            </div>
          </GradientBorderCard>
        </SectionReveal>
      </div>
    </section>
  );
}
