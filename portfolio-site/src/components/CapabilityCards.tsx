'use client';

import { motion, useInView } from 'framer-motion';
import { Monitor, Server, Cloud, Brain } from 'lucide-react';
import { useRef } from 'react';
import SectionReveal from './SectionReveal';
import { GradientBorderCard } from './AnimatedElements';

/* ── Frontend: Interactive Component Tree ── */
function ComponentTreeViz() {
  const treeNodes = [
    { id: 'app', label: '<App />', x: 120, y: 18, primary: true },
    { id: 'layout', label: '<Layout>', x: 40, y: 65 },
    { id: 'router', label: '<Router>', x: 120, y: 65 },
    { id: 'state', label: '<State>', x: 200, y: 65 },
    { id: 'page', label: '<Page>', x: 70, y: 112 },
    { id: 'ui', label: '<UI>', x: 155, y: 112 },
    { id: 'hook', label: 'useAPI()', x: 200, y: 145, isHook: true },
  ];
  const edges: [number, number][] = [
    [0, 1], [0, 2], [0, 3], [2, 4], [2, 5], [3, 6],
  ];

  return (
    <div className="relative h-44 flex items-center justify-center">
      <svg viewBox="0 0 240 165" className="w-full h-full">
        {edges.map(([from, to], i) => (
          <motion.line
            key={i}
            x1={treeNodes[from].x}
            y1={treeNodes[from].y + 12}
            x2={treeNodes[to].x}
            y2={treeNodes[to].y - 6}
            stroke="url(#tree-line-grad)"
            strokeWidth={1}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
          />
        ))}

        <defs>
          <linearGradient id="tree-line-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {treeNodes.map((node, i) => (
          <motion.g
            key={node.id}
            initial={{ opacity: 0, scale: 0, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1, type: 'spring', stiffness: 300, damping: 20 }}
          >
            <rect
              x={node.x - 28}
              y={node.y - 9}
              width={56}
              height={20}
              rx={5}
              className={`${
                node.primary
                  ? 'fill-[rgba(6,182,212,0.15)] stroke-cyan-400/60'
                  : node.isHook
                  ? 'fill-[rgba(139,92,246,0.12)] stroke-purple-400/40'
                  : 'fill-[rgba(15,23,42,0.5)] stroke-cyan-500/20'
              }`}
              strokeWidth={0.8}
            />
            <text
              x={node.x}
              y={node.y + 4}
              textAnchor="middle"
              className={`text-[7px] font-mono font-medium select-none pointer-events-none ${
                node.isHook ? 'fill-purple-400' : 'fill-cyan-400'
              }`}
            >
              {node.label}
            </text>
          </motion.g>
        ))}

        {/* Animated state flow pulse */}
        <motion.circle
          r={4}
          fill="none"
          stroke="#06b6d4"
          strokeWidth={1.5}
          animate={{
            cx: [treeNodes[0].x, treeNodes[2].x, treeNodes[5].x, treeNodes[0].x],
            cy: [treeNodes[0].y, treeNodes[2].y, treeNodes[5].y, treeNodes[0].y],
            opacity: [0, 0.8, 0.8, 0.8, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
}

/* ── Backend: API Request Pipeline ── */
function ApiFlowViz() {
  const steps = [
    { label: 'REQ', color: 'from-cyan-500/20 to-cyan-500/5' },
    { label: 'AUTH', color: 'from-blue-500/20 to-blue-500/5' },
    { label: 'LOGIC', color: 'from-purple-500/20 to-purple-500/5' },
    { label: 'DATA', color: 'from-blue-500/20 to-blue-500/5' },
    { label: 'RES', color: 'from-emerald-500/20 to-emerald-500/5' },
  ];

  return (
    <div className="h-44 flex items-center justify-center px-2">
      <div className="flex items-center gap-1 w-full justify-center">
        {steps.map((step, i) => (
          <motion.div
            key={step.label}
            className="flex items-center"
            initial={{ opacity: 0, x: -20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: i * 0.12, duration: 0.5, type: 'spring' }}
          >
            <div className="relative group">
              <div className={`px-3 py-2.5 bg-gradient-to-b ${step.color} rounded-lg border border-cyan-500/15`}>
                <span className="text-[9px] font-mono font-bold text-cyan-400 block text-center">
                  {step.label}
                </span>
              </div>
              {/* Active scan line */}
              <motion.div
                className="absolute inset-0 rounded-lg overflow-hidden"
                style={{ opacity: 0.6 }}
              >
                <motion.div
                  className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
                  animate={{ y: ['-4px', '28px'] }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.3,
                    repeat: Infinity,
                    repeatDelay: steps.length * 0.3,
                    ease: 'linear',
                  }}
                />
              </motion.div>
            </div>
            {i < steps.length - 1 && (
              <motion.div className="flex items-center mx-0.5">
                <motion.div
                  className="w-4 h-px bg-gradient-to-r from-cyan-500/40 to-blue-500/40"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: i * 0.12 + 0.2, duration: 0.3 }}
                />
                <motion.div
                  className="w-1 h-1 rounded-full bg-cyan-400"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Cloud: CI/CD Pipeline ── */
function CiCdViz() {
  const stages = [
    { label: 'Commit', icon: '●' },
    { label: 'Build', icon: '⚙' },
    { label: 'Test', icon: '✓' },
    { label: 'Stage', icon: '◐' },
    { label: 'Deploy', icon: '▲' },
  ];

  return (
    <div className="h-44 flex items-center justify-center">
      <div className="relative w-full flex flex-col items-center gap-4">
        {/* Pipeline track */}
        <div className="flex items-center gap-1 w-full justify-center">
          {stages.map((stage, i) => (
            <motion.div
              key={stage.label}
              className="flex items-center"
              initial={{ opacity: 0, y: 30, scale: 0 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.15, duration: 0.5, type: 'spring', stiffness: 200 }}
            >
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  className="w-10 h-10 rounded-full border border-cyan-500/20 flex items-center justify-center bg-slate-800/40 relative overflow-hidden"
                  whileHover={{ scale: 1.15, borderColor: 'rgba(6,182,212,0.6)' }}
                >
                  {/* Fill animation */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent rounded-full"
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    transition={{ delay: 1.2 + i * 0.4, duration: 0.6, ease: 'easeOut' }}
                  />
                  <span className="text-cyan-400 text-xs relative z-10">{stage.icon}</span>
                </motion.div>
                <span className="text-[8px] text-slate-400 dark:text-slate-500 font-medium tracking-wide">
                  {stage.label}
                </span>
              </div>
              {i < stages.length - 1 && (
                <div className="relative mx-0.5 mb-6">
                  <motion.div
                    className="w-4 h-px bg-slate-700/50"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: i * 0.15 + 0.3 }}
                  />
                  <motion.div
                    className="absolute top-0 left-0 w-4 h-px bg-cyan-400"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: [0, 1, 0] }}
                    transition={{
                      delay: 1.5 + i * 0.4,
                      duration: 0.8,
                      repeat: Infinity,
                      repeatDelay: stages.length * 0.4,
                    }}
                    style={{ transformOrigin: 'left' }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
        {/* Deploy counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="text-[9px] font-mono text-emerald-400/60"
        >
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✓ 847 successful deployments
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
}

/* ── AI: Neural Waveform ── */
function WaveformViz() {
  const barCount = 24;
  const bars = Array.from({ length: barCount }, (_, i) => ({
    maxH: 12 + Math.sin(i * 0.5) * 18 + Math.random() * 12,
  }));

  return (
    <div className="h-44 flex flex-col items-center justify-center gap-4">
      {/* Labels */}
      <div className="flex items-center gap-3 w-full justify-center">
        <motion.span
          className="text-[8px] font-mono px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          INPUT
        </motion.span>
        <div className="flex items-end gap-[2px] h-16">
          {bars.map((bar, i) => (
            <motion.div
              key={i}
              className="w-[3px] bg-gradient-to-t from-cyan-500 via-blue-500 to-purple-500 rounded-full"
              animate={{
                height: ['6px', `${bar.maxH}px`, '6px'],
                opacity: [0.4, 0.9, 0.4],
              }}
              transition={{
                duration: 1.5 + Math.random() * 0.5,
                delay: i * 0.06,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
        <motion.span
          className="text-[8px] font-mono px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          OUTPUT
        </motion.span>
      </div>

      {/* Processing indicator */}
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="w-2 h-2 rounded-full bg-purple-400"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="text-[8px] font-mono text-slate-400">processing inference...</span>
      </motion.div>
    </div>
  );
}

/* ── Card Data ── */
const capabilities = [
  {
    icon: Monitor,
    title: 'Frontend Systems',
    subtitle: 'React · Next.js · TypeScript',
    description: 'Component architecture, state machines, and rendering pipelines optimized for performance.',
    Visual: ComponentTreeViz,
    accent: 'from-cyan-500 to-blue-500',
    accentBg: 'bg-cyan-500/10',
  },
  {
    icon: Server,
    title: 'Backend Architecture',
    subtitle: 'FastAPI · Django · Node.js',
    description: 'API design, authentication layers, service orchestration, and data flow management.',
    Visual: ApiFlowViz,
    accent: 'from-blue-500 to-purple-500',
    accentBg: 'bg-blue-500/10',
  },
  {
    icon: Cloud,
    title: 'Cloud & Infrastructure',
    subtitle: 'AWS · Docker · Kubernetes',
    description: 'CI/CD automation, container orchestration, IaC, and multi-region deployment strategies.',
    Visual: CiCdViz,
    accent: 'from-purple-500 to-pink-500',
    accentBg: 'bg-purple-500/10',
  },
  {
    icon: Brain,
    title: 'AI & Real-Time',
    subtitle: 'ML Pipelines · Streaming',
    description: 'Model integration, streaming data pipelines, real-time inference, and intelligent automation.',
    Visual: WaveformViz,
    accent: 'from-pink-500 to-cyan-500',
    accentBg: 'bg-pink-500/10',
  },
];

export default function CapabilityCards() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="capabilities" className="py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 dark:via-cyan-950/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10" ref={ref}>
        <SectionReveal>
          <div className="text-center mb-20">
            <motion.p
              className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400 font-semibold mb-4"
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              animate={isInView ? { opacity: 1, letterSpacing: '0.3em' } : {}}
              transition={{ duration: 1 }}
            >
              Capabilities
            </motion.p>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
              What I <span className="gradient-text">Build</span>
            </h2>
          </div>
        </SectionReveal>

        <div className="grid sm:grid-cols-2 gap-8">
          {capabilities.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <SectionReveal key={cap.title} delay={i * 0.12}>
                <GradientBorderCard>
                  <div className="p-8 h-full">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${cap.accentBg}`}>
                          <Icon size={22} className="text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-base">
                            {cap.title}
                          </h3>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                            {cap.subtitle}
                          </p>
                        </div>
                      </div>
                      {/* Number badge */}
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded-md">
                        0{i + 1}
                      </span>
                    </div>

                    {/* Visual */}
                    <div className="my-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/20 border border-slate-200/50 dark:border-slate-700/30 overflow-hidden">
                      <cap.Visual />
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                </GradientBorderCard>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
