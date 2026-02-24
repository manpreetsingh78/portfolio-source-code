'use client';

import { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { AnimatedCounter } from './AnimatedElements';

interface ArchNode {
  id: string;
  label: string;
  x: number;
  y: number;
  tip: string;
  icon: string;
}

const nodes: ArchNode[] = [
  { id: 'client', label: 'Client', x: 80, y: 50, tip: 'Browser & Mobile', icon: '◈' },
  { id: 'edge', label: 'Edge', x: 240, y: 30, tip: 'CDN & Edge Functions', icon: '⬡' },
  { id: 'api', label: 'API', x: 400, y: 50, tip: 'Gateway & Auth', icon: '◉' },
  { id: 'service', label: 'Service', x: 140, y: 160, tip: 'Business Logic', icon: '⬢' },
  { id: 'queue', label: 'Queue', x: 320, y: 160, tip: 'Message Broker', icon: '▥' },
  { id: 'deploy', label: 'Deploy', x: 460, y: 160, tip: 'CI/CD Pipeline', icon: '▲' },
  { id: 'db', label: 'DB', x: 80, y: 280, tip: 'Primary Store', icon: '◧' },
  { id: 'cache', label: 'Cache', x: 240, y: 280, tip: 'In-Memory Layer', icon: '⚡' },
  { id: 'ml', label: 'ML', x: 400, y: 280, tip: 'AI Pipeline', icon: '◆' },
];

const connections: [string, string][] = [
  ['client', 'edge'],
  ['edge', 'api'],
  ['client', 'service'],
  ['api', 'queue'],
  ['api', 'deploy'],
  ['service', 'db'],
  ['service', 'cache'],
  ['queue', 'cache'],
  ['queue', 'ml'],
  ['deploy', 'ml'],
  ['db', 'cache'],
  ['cache', 'ml'],
];

function getCurvedPath(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const cx = mx - dy * 0.15;
  const cy = my + dx * 0.15;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

export default function SystemBlueprint() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeFlow, setActiveFlow] = useState(0);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });
  const getNode = (id: string) => nodes.find((n) => n.id === id)!;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFlow((prev) => (prev + 1) % connections.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Outer glow ring */}
      <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 rounded-3xl blur-2xl" />

      {/* Main container */}
      <div className="relative glass rounded-2xl border border-slate-200 dark:border-cyan-500/10 bg-white/40 dark:bg-slate-900/40 p-4 overflow-hidden">
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-cyan-500/30 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-blue-500/30 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-purple-500/30 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-cyan-500/30 rounded-br-2xl" />

        {/* Status bar */}
        <div className="flex items-center gap-2 mb-3 px-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          </div>
          <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 ml-2">
            system-blueprint.arch
          </span>
          <div className="flex-1" />
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[9px] font-mono text-emerald-500"
          >
            ● LIVE
          </motion.span>
        </div>

        {/* SVG Diagram */}
        <svg
          viewBox="0 0 530 340"
          className="w-full h-auto"
          role="img"
          aria-label="Animated system architecture diagram"
        >
          <defs>
            <filter id="neon-glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="subtle-glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="conn-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
            </linearGradient>
            <radialGradient id="node-bg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid dots */}
          <pattern id="bp-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.3" fill="currentColor" opacity="0.08" />
          </pattern>
          <rect width="530" height="340" fill="url(#bp-grid)" />

          {/* Connections */}
          {connections.map(([fromId, toId], i) => {
            const from = getNode(fromId);
            const to = getNode(toId);
            const isActive = activeFlow === i;
            const isHoveredConn = hovered === fromId || hovered === toId;
            const path = getCurvedPath(from.x, from.y, to.x, to.y);

            return (
              <g key={`${fromId}-${toId}`}>
                {isInView && (
                  <motion.path
                    d={path}
                    fill="none"
                    stroke={isHoveredConn ? '#06b6d4' : 'url(#conn-grad)'}
                    strokeWidth={isHoveredConn ? 1.5 : 0.8}
                    strokeDasharray="4 6"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: isHoveredConn ? 0.8 : 0.4 }}
                    transition={{ duration: 1.2, delay: 0.5 + i * 0.08, ease: 'easeOut' }}
                  />
                )}
                {isInView && (
                  <motion.circle
                    r={isActive ? 3 : 1.5}
                    fill="#06b6d4"
                    filter={isActive ? 'url(#neon-glow)' : 'url(#subtle-glow)'}
                    initial={{ opacity: 0 }}
                    animate={{
                      cx: [from.x, to.x],
                      cy: [from.y, to.y],
                      opacity: [0, isActive ? 1 : 0.5, isActive ? 1 : 0.5, 0],
                    }}
                    transition={{
                      duration: isActive ? 1.5 : 3,
                      delay: isActive ? 0 : 1.5 + i * 0.4,
                      repeat: Infinity,
                      repeatDelay: isActive ? 0.5 : 3 + i * 0.5,
                      ease: 'easeInOut',
                    }}
                  />
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node, i) => {
            const isHovered = hovered === node.id;
            return (
              <motion.g
                key={node.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.2 + i * 0.08,
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                }}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer"
                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              >
                {/* Pulse ring on hover */}
                {isHovered && (
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth={0.5}
                    initial={{ r: 25, opacity: 0.8 }}
                    animate={{ r: 45, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}

                <circle
                  cx={node.x}
                  cy={node.y}
                  r={32}
                  fill="url(#node-bg)"
                  className={`transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-30'}`}
                />

                <rect
                  x={node.x - 40}
                  y={node.y - 18}
                  width={80}
                  height={36}
                  rx={8}
                  className={`transition-all duration-300 ${
                    isHovered
                      ? 'fill-[rgba(6,182,212,0.12)] stroke-cyan-400'
                      : 'fill-[rgba(15,23,42,0.6)] stroke-[rgba(6,182,212,0.15)]'
                  }`}
                  strokeWidth={isHovered ? 1.5 : 0.8}
                />

                <text
                  x={node.x - 18}
                  y={node.y + 1}
                  className="fill-cyan-500 text-[11px] select-none pointer-events-none"
                >
                  {node.icon}
                </text>
                <text
                  x={node.x + 6}
                  y={node.y + 4}
                  textAnchor="middle"
                  className={`text-[10px] font-semibold select-none pointer-events-none tracking-wide transition-all duration-300 ${
                    isHovered ? 'fill-cyan-300' : 'fill-slate-300'
                  }`}
                >
                  {node.label}
                </text>

                <motion.circle
                  cx={node.x + 30}
                  cy={node.y - 10}
                  r={2.5}
                  fill="#10b981"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                />

                {isHovered && (
                  <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                    <rect
                      x={node.x - 50}
                      y={node.y - 46}
                      width={100}
                      height={24}
                      rx={6}
                      fill="rgba(6, 182, 212, 0.95)"
                      filter="url(#subtle-glow)"
                    />
                    <polygon
                      points={`${node.x - 4},${node.y - 22} ${node.x + 4},${node.y - 22} ${node.x},${node.y - 17}`}
                      fill="rgba(6, 182, 212, 0.95)"
                    />
                    <text x={node.x} y={node.y - 30} textAnchor="middle" className="fill-white text-[10px] font-semibold">
                      {node.tip}
                    </text>
                  </motion.g>
                )}
              </motion.g>
            );
          })}
        </svg>

        {/* Dashboard panels */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="rounded-xl p-4 bg-slate-50/80 dark:bg-slate-800/30 border border-slate-200 dark:border-cyan-500/10"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <p className="text-[10px] uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-semibold">
                System Health
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Uptime', value: 99.97, suffix: '%', color: 'text-emerald-400' },
                { label: 'Latency', value: 42, suffix: 'ms', color: 'text-cyan-400' },
                { label: 'Error Rate', value: 0.02, suffix: '%', color: 'text-emerald-400' },
                { label: 'Deploy/wk', value: 12, suffix: '', color: 'text-blue-400' },
              ].map((stat, idx) => (
                <div key={stat.label} className="text-center py-1">
                  <p className={`text-sm font-mono font-bold ${stat.color}`}>
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} delay={1.8 + idx * 0.15} />
                  </p>
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.7, duration: 0.6 }}
            className="rounded-xl p-4 bg-slate-50/80 dark:bg-slate-800/30 border border-slate-200 dark:border-cyan-500/10"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <p className="text-[10px] uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-semibold">
                Trade-offs
              </p>
            </div>
            {[
              { label: 'Scale', value: 82, color: 'from-cyan-500 to-blue-500' },
              { label: 'Cost', value: 35, color: 'from-emerald-500 to-cyan-500' },
              { label: 'Latency', value: 65, color: 'from-blue-500 to-purple-500' },
              { label: 'Security', value: 90, color: 'from-purple-500 to-pink-500' },
            ].map((item, idx) => (
              <div key={item.label} className="mb-1.5 last:mb-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">{item.label}</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">{item.value}%</span>
                </div>
                <div className="h-1 bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${item.value}%` } : {}}
                    transition={{ duration: 1.5, delay: 2 + idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
