'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Code2, Palette, Server, Database, Cloud, Boxes } from 'lucide-react';
import SectionReveal from './SectionReveal';

const skillCategories = [
  {
    title: 'Languages',
    icon: Code2,
    color: 'from-cyan-500 to-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20',
    textColor: 'text-cyan-400',
    skills: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'HTML', 'CSS'],
  },
  {
    title: 'Frontend',
    icon: Palette,
    color: 'from-blue-500 to-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    textColor: 'text-blue-400',
    skills: ['React', 'Next.js', 'Tailwind CSS', 'Redux', 'Framer Motion', 'Responsive Design'],
  },
  {
    title: 'Backend',
    icon: Server,
    color: 'from-purple-500 to-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    textColor: 'text-purple-400',
    skills: ['FastAPI', 'Django', 'Node.js', 'Express', 'REST APIs', 'GraphQL'],
  },
  {
    title: 'Databases',
    icon: Database,
    color: 'from-emerald-500 to-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    textColor: 'text-emerald-400',
    skills: ['PostgreSQL', 'MongoDB', 'Redis', 'DynamoDB', 'MySQL'],
  },
  {
    title: 'Cloud & DevOps',
    icon: Cloud,
    color: 'from-orange-500 to-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    textColor: 'text-orange-400',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'GitHub Actions'],
  },
  {
    title: 'Architecture',
    icon: Boxes,
    color: 'from-pink-500 to-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/20',
    textColor: 'text-pink-400',
    skills: ['Microservices', 'System Design', 'Event-Driven', 'Message Queues', 'Caching Strategies', 'API Gateway'],
  },
];

function SkillChip({ skill, delay, accentColor }: { skill: string; delay: number; accentColor: string }) {
  return (
    <motion.span
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-100/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/40 hover:border-current hover:${accentColor} transition-all duration-300 cursor-default group`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.05, y: -2 }}
    >
      <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${accentColor === 'text-cyan-400' ? 'from-cyan-400 to-cyan-500' : accentColor === 'text-blue-400' ? 'from-blue-400 to-blue-500' : accentColor === 'text-purple-400' ? 'from-purple-400 to-purple-500' : accentColor === 'text-emerald-400' ? 'from-emerald-400 to-emerald-500' : accentColor === 'text-orange-400' ? 'from-orange-400 to-orange-500' : 'from-pink-400 to-pink-500'} opacity-60 group-hover:opacity-100 transition-opacity`} />
      {skill}
    </motion.span>
  );
}

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  return (
    <section id="skills" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/30 dark:via-cyan-950/5 to-transparent" />

      {/* Subtle circuit pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.02] dark:opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 50 35 M 50 65 L 50 100 M 0 50 L 35 50 M 65 50 L 100 50" stroke="#06b6d4" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="50" r="3" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)" />
      </svg>

      <div className="max-w-7xl mx-auto px-6 relative z-10" ref={ref}>
        <SectionReveal>
          <div className="text-center mb-20">
            <motion.p
              className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400 font-semibold mb-4"
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              animate={isInView ? { opacity: 1, letterSpacing: '0.3em' } : {}}
              transition={{ duration: 1 }}
            >
              Skills
            </motion.p>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
              Technical <span className="gradient-text">Stack</span>
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm">
              A comprehensive toolkit refined over years of building production systems
            </p>
          </div>
        </SectionReveal>

        {/* Total skills counter */}
        <SectionReveal>
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate-100/80 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/30"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Total Technologies:</span>
              <span className="text-lg font-bold gradient-text">
                {skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0)}+
              </span>
            </motion.div>
          </div>
        </SectionReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, i) => {
            const Icon = category.icon;
            const isHovered = hoveredCategory === i;

            return (
              <SectionReveal key={category.title} delay={i * 0.08}>
                <motion.div
                  className="relative group h-full"
                  onHoverStart={() => setHoveredCategory(i)}
                  onHoverEnd={() => setHoveredCategory(null)}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Glow effect on hover */}
                  <motion.div
                    className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r ${category.color} opacity-0 blur-sm transition-opacity duration-500`}
                    animate={{ opacity: isHovered ? 0.15 : 0 }}
                  />

                  <div className={`relative glass rounded-2xl p-6 bg-white/60 dark:bg-slate-900/60 border ${category.borderColor} h-full transition-all duration-500`}>
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-5">
                      <motion.div
                        className={`p-2.5 rounded-xl ${category.bgColor}`}
                        animate={isHovered ? { rotate: [0, -5, 5, 0] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon size={20} className={category.textColor} />
                      </motion.div>
                      <div>
                        <h3 className={`text-sm font-bold ${category.textColor} uppercase tracking-wider`}>
                          {category.title}
                        </h3>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                          {category.skills.length} skills
                        </p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill, j) => (
                        <SkillChip
                          key={skill}
                          skill={skill}
                          delay={0.3 + i * 0.08 + j * 0.04}
                          accentColor={category.textColor}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
